import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

interface CollectionRouteMapProps {
    routes: any[];
    filteredRoutes: any[];
    selectedRoute: string | null;
    setSelectedRoute: (id: string | null) => void;
    onViewDetail: (id: string) => void;
}

const CollectionRouteMap: React.FC<CollectionRouteMapProps> = ({
    routes,
    filteredRoutes,
    selectedRoute,
    setSelectedRoute,
    onViewDetail,
}) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markers = useRef<{ marker: mapboxgl.Marker; popup: mapboxgl.Popup }[]>([]);
    const onViewDetailRef = useRef(onViewDetail);

    useEffect(() => {
        onViewDetailRef.current = onViewDetail;
    }, [onViewDetail]);

    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [106.6297, 10.8231],
            zoom: 11
        });

        return () => {
            markers.current.forEach(({ marker, popup }) => {
                try {
                    popup.remove();
                    marker.remove();
                } catch {}
            });
            if (map.current) {
                try {
                    map.current.remove();
                } catch {}
                map.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!map.current) return;

        markers.current.forEach(({ marker, popup }) => {
            try {
                popup.remove();
                marker.remove();
            } catch {}
        });
        markers.current = [];

        filteredRoutes.forEach((route) => {
            if (!map.current) return;

            const lng = route.sender?.ing;
            const lat = route.sender?.iat;
            if (typeof lng !== 'number' || typeof lat !== 'number' || isNaN(lng) || isNaN(lat)) return;

            const popupContent = `
                <div style="padding: 12px; min-width: 220px; font-family: system-ui, -apple-system, sans-serif;">
                    <div style="display: flex; gap: 12px; align-items: start;">
                        <img 
                            src="${route.pickUpItemImages?.[0] || '/placeholder.png'}" 
                            alt="${route.itemName}"
                            style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover; flex-shrink: 0;"
                        />
                        <div style="flex: 1; min-width: 0;">
                            <h3 style="margin: 0 0 6px 0; font-size: 15px; font-weight: 600; color: #111827; line-height: 1.3;">
                                ${route.itemName}
                            </h3>
                            <p style="margin: 0 0 4px 0; font-size: 13px; color: #6b7280; line-height: 1.4;">
                                ${route.address}
                            </p>
                            <p style="margin: 0 0 8px 0; font-size: 12px; color: #9ca3af;">
                                ${route.estimatedTime}
                            </p>
                            <button 
                                id="view-detail-${route.collectionRouteId}" 
                                style="display:flex;align-items:center;gap:4px;padding:6px 12px;border-radius:8px;background:#3b82f6;color:white;border:none;cursor:pointer;font-size:13px;font-weight:500;"
                            >
                                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                </div>
            `;

            const popup = new mapboxgl.Popup({
                offset: 30,
                closeButton: false,
                closeOnClick: false,
                maxWidth: '340px',
                className: 'custom-popup'
            }).setHTML(popupContent);

            const markerColor = 
                route.status === 'Chưa bắt đầu' ? '#eab308' :
                route.status === 'Đang tiến hành' ? '#3b82f6' :
                route.status === 'Hoàn thành' ? '#22c55e' :
                '#ef4444';

            let marker: mapboxgl.Marker | undefined;
            try {
                marker = new mapboxgl.Marker({ 
                    color: markerColor,
                    scale: 0.9
                })
                    .setLngLat([lng, lat])
                    .addTo(map.current);
            } catch {
                return;
            }

            markers.current.push({ marker, popup });

            marker.getElement().addEventListener('click', (e) => {
                e.stopPropagation();
                markers.current.forEach(m => m.popup.remove());
                popup.setLngLat([lng, lat]).addTo(map.current!);
                setSelectedRoute(route.collectionRouteId);

                setTimeout(() => {
                    const btn = document.getElementById(`view-detail-${route.collectionRouteId}`);
                    if (btn) {
                        btn.onclick = (ev) => {
                            ev.stopPropagation();
                            onViewDetailRef.current(route.collectionRouteId);
                        };
                    }
                }, 100);
            });
        });

        map.current.on('click', () => {
            markers.current.forEach(m => m.popup.remove());
            setSelectedRoute(null);
        });

    }, [filteredRoutes, setSelectedRoute]);

    useEffect(() => {
        if (!selectedRoute || !map.current) return;

        const route = filteredRoutes.find(r => r.collectionRouteId === selectedRoute);
        if (!route) return;

        const lng = route.sender?.ing;
        const lat = route.sender?.iat;
        if (typeof lng !== 'number' || typeof lat !== 'number' || isNaN(lng) || isNaN(lat)) return;

        markers.current.forEach(m => m.popup.remove());
        
        const markerIndex = filteredRoutes.findIndex(r => r.collectionRouteId === selectedRoute);
        const markerData = markers.current[markerIndex];
        if (markerData) {
            try {
                markerData.popup.setLngLat([lng, lat]).addTo(map.current);

                setTimeout(() => {
                    const btn = document.getElementById(`view-detail-${route.collectionRouteId}`);
                    if (btn) {
                        btn.onclick = (ev) => {
                            ev.stopPropagation();
                            onViewDetailRef.current(route.collectionRouteId);
                        };
                    }
                }, 100);
            } catch {}
        }

        try {
            map.current.flyTo({
                center: [lng, lat],
                zoom: 14,
                duration: 1000
            });
        } catch {}
    }, [selectedRoute, filteredRoutes]);

    return <div ref={mapContainer} className='w-full h-full' />;
};

export default CollectionRouteMap;