'use client';

import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { SmallCollectionPoint } from '@/types';
import { createPopupContent } from './SmallCollectionPopupContent';

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

            const popupContent = createPopupContent(point);

            const popup = new mapboxgl.Popup({
                offset: 35,
                closeButton: false,
                closeOnClick: false,
                maxWidth: '280px',
                className: 'custom-popup'
            }).setHTML(popupContent);

            // Use Tailwind config colors
            const primary600 = '#e85a4f';
            const danger = '#ef4444';
            const markerColor = point.status === 'Active' ? primary600 : danger;

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
                    el.style.boxShadow = point.status === 'Active'
                        ? '0 8px 24px rgba(232,90,79,0.28)'
                        : '0 8px 24px rgba(239,68,68,0.28)';
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
