import { useState } from 'react';
import type { CountryMemberPin } from '../../types';
import './WorldMapWidget.css';

interface WorldMapWidgetProps {
  pins: CountryMemberPin[];
}

export function WorldMapWidget({ pins }: WorldMapWidgetProps) {
  const [hoveredPin, setHoveredPin] = useState<CountryMemberPin | null>(null);

  const totalMembers = pins.reduce((sum, p) => sum + p.memberCount, 0);

  return (
    <div className="world-map-widget">
      <div className="world-map-widget__header">
        <div>
          <h4 className="world-map-widget__title">🌐 Member Density & Map</h4>
          <span className="world-map-widget__subtitle">
            {totalMembers.toLocaleString()} active practitioners worldwide
          </span>
        </div>
      </div>

      {/* Interactive SVG World Map Container */}
      <div className="world-map-widget__map-container">
        <svg
          viewBox="0 0 1000 500"
          className="world-map-widget__svg"
          aria-label="Interactive World Map"
        >
          {/* Stylized Dark SVG World Map Continents Outline */}
          <path
            className="world-map-widget__continent"
            d="M 150 120 Q 220 100 280 130 T 320 220 T 260 280 T 180 240 Z" /* North America */
          />
          <path
            className="world-map-widget__continent"
            d="M 280 300 Q 340 320 360 420 T 300 480 T 260 380 Z" /* South America */
          />
          <path
            className="world-map-widget__continent"
            d="M 460 100 Q 550 80 600 120 T 580 220 T 480 180 Z" /* Europe */
          />
          <path
            className="world-map-widget__continent"
            d="M 460 220 Q 560 240 580 380 T 480 440 T 420 300 Z" /* Africa */
          />
          <path
            className="world-map-widget__continent"
            d="M 620 100 Q 820 90 900 180 T 850 320 T 680 280 Z" /* Asia */
          />
          <path
            className="world-map-widget__continent"
            d="M 780 360 Q 880 350 920 420 T 820 460 Z" /* Australia */
          />
        </svg>

        {/* Interactive Member Pins Overlaid on Coordinates */}
        {pins.map((pin) => (
          <div
            key={pin.countryCode}
            className={`world-map-widget__pin ${
              hoveredPin?.countryCode === pin.countryCode ? 'world-map-widget__pin--active' : ''
            }`}
            style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
            onMouseEnter={() => setHoveredPin(pin)}
            onMouseLeave={() => setHoveredPin(null)}
          >
            <span className="world-map-widget__pin-pulse" />
            <span className="world-map-widget__pin-flag">{pin.flag}</span>
          </div>
        ))}

        {/* Hover Tooltip Preview */}
        {hoveredPin && (
          <div
            className="world-map-widget__tooltip"
            style={{
              left: `${Math.min(75, Math.max(25, hoveredPin.xPercent))}%`,
              top: `${Math.max(15, hoveredPin.yPercent - 22)}%`,
            }}
          >
            <div className="world-map-widget__tooltip-header">
              <span>{hoveredPin.flag}</span>
              <strong>{hoveredPin.countryName}</strong>
              <span className="world-map-widget__tooltip-count">
                {hoveredPin.memberCount.toLocaleString()} members
              </span>
            </div>
            <div className="world-map-widget__tooltip-members">
              {hoveredPin.topMembers.map((m) => (
                <div key={m.name} className="world-map-widget__tooltip-member">
                  <div className="world-map-widget__tooltip-avatar">{m.avatar}</div>
                  <div>
                    <strong>{m.name}</strong>
                    <small>{m.role}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Country Leaderboard Summary */}
      <div className="world-map-widget__countries-list">
        {pins.slice(0, 3).map((pin) => (
          <div
            key={pin.countryCode}
            className="world-map-widget__country-row"
            onMouseEnter={() => setHoveredPin(pin)}
            onMouseLeave={() => setHoveredPin(null)}
          >
            <span>{pin.flag} {pin.countryName}</span>
            <strong>{pin.memberCount.toLocaleString()}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
