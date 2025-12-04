'use client';

import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { SmallCollectionPoint } from '@/types';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

interface SmallCollectionMapProps {
    collections: SmallCollectionPoint[];
    selectedId: number | null;
    onSelectPoint: (id: number | null) => void;
    onViewDetail: (point: SmallCollectionPoint) => void;
}

const SmallCollectionMap: React.FC<SmallCollectionMapProps> = ({
    collections,
    selectedId,
    onSelectPoint,
    onViewDetail
}) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markers = useRef<
        {
            marker: mapboxgl.Marker;
            popup: mapboxgl.Popup;
            point: SmallCollectionPoint;
        }[]
    >([]);
    const onViewDetailRef = useRef(onViewDetail);

    useEffect(() => {
        onViewDetailRef.current = onViewDetail;
    }, [onViewDetail]);

    // Initialize map
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

    // Update markers
    useEffect(() => {
        if (!map.current) return;

        // Remove old markers
        markers.current.forEach(({ marker, popup }) => {
            try {
                popup.remove();
                marker.remove();
            } catch {}
        });
        markers.current = [];

        // Add new markers
        collections.forEach((point) => {
            if (!map.current) return;

            const lng = point.longitude;
            const lat = point.latitude;
            if (typeof lng !== 'number' || typeof lat !== 'number' || isNaN(lng) || isNaN(lat)) return;

            const popupContent = `
                <div style="background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); padding: 12px 16px; min-width: 200px; max-width: 280px; font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; gap: 12px;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: ${
                        point.status === 'Active' ? '#3b82f6' : '#ef4444'
                    }; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <svg width="18" height="18" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"/><circle cx="12" cy="9" r="2.5"/></svg>
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 2px; line-height: 1.3;">${
                            point.name
                        }</div>
                        <div style="font-size: 13px; color: #6b7280; font-weight: 400; line-height: 1.4;">${
                            point.address
                        }</div>
                    </div>
                </div>
            `;

            const popup = new mapboxgl.Popup({
                offset: 35,
                closeButton: false,
                closeOnClick: false,
                maxWidth: '280px',
                className: 'custom-popup'
            }).setHTML(popupContent);

            const markerColor =
                point.status === 'Active' ? '#3b82f6' : '#ef4444';

            let marker: mapboxgl.Marker;
            try {
                const el = document.createElement('div');
                el.className = 'custom-marker';
                el.style.width = '38px';
                el.style.height = '38px';
                el.style.cursor = 'pointer';
                el.style.transition = 'box-shadow 0.2s';
                el.innerHTML = `
                    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="${markerColor}" flood-opacity="0.25"/>
                        </filter>
                        <path filter="url(#shadow)" d="M19 2C12.3726 2 7 7.37258 7 14C7 22.25 19 36 19 36C19 36 31 22.25 31 14C31 7.37258 25.6274 2 19 2Z" fill="${markerColor}" stroke="#fff" stroke-width="2"/>
                        <circle cx="19" cy="14" r="5" fill="#fff" stroke="${markerColor}" stroke-width="2"/>
                    </svg>
                `;
                el.onmouseenter = () => {
                    el.style.boxShadow = '0 8px 24px rgba(59,130,246,0.28)';
                };
                el.onmouseleave = () => {
                    el.style.boxShadow = 'none';
                };
                marker = new mapboxgl.Marker(el)
                    .setLngLat([lng, lat])
                    .addTo(map.current);
            } catch {
                marker = new mapboxgl.Marker({ color: markerColor })
                    .setLngLat([lng, lat])
                    .addTo(map.current);
            }

            markers.current.push({ marker, popup, point });

            marker.getElement().addEventListener('click', (e) => {
                e.stopPropagation();
                markers.current.forEach((m) => m.popup.remove());
                onSelectPoint(point.id);

                try {
                    popup.setLngLat([lng, lat]).addTo(map.current!);
                } catch {}
            });
        });

        map.current.on('click', () => {
            markers.current.forEach((m) => m.popup.remove());
            onSelectPoint(null);
        });
    }, [collections, onSelectPoint]);

    // Handle selected point
    useEffect(() => {
        if (!selectedId || !map.current) return;

        const selected = markers.current.find((m) => m.point.id === selectedId);
        if (!selected) return;

        const { point, popup } = selected;
        const lng = point.longitude;
        const lat = point.latitude;
        if (
            typeof lng !== 'number' ||
            typeof lat !== 'number' ||
            isNaN(lng) ||
            isNaN(lat)
        )
            return;

        markers.current.forEach((m) => m.popup.remove());

        try {
            popup.addTo(map.current);
            setTimeout(() => {
                const btn = document.getElementById(`view-detail-${point.id}`);
                if (btn) {
                    btn.onclick = () => {
                        popup.remove();
                        onViewDetailRef.current(point);
                    };
                }
            }, 100);
        } catch {}
    }, [selectedId]);

    return <div ref={mapContainer} className='w-full h-full' />;
    };
export default SmallCollectionMap;
