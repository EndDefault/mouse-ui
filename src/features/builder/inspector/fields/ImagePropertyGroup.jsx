import { PropertyRow } from "./PropertyRow.jsx";

export function ImagePropertyGroup({ component, onChange }) {
  const { alt, src } = component.props;

  return (
    <section className="property-group">
      <h3>이미지</h3>
      <PropertyRow label="URL">
        <input
          type="url"
          value={src}
          onChange={(event) => onChange({ src: event.target.value })}
        />
      </PropertyRow>
      <PropertyRow label="설명">
        <input
          type="text"
          value={alt}
          onChange={(event) => onChange({ alt: event.target.value })}
        />
      </PropertyRow>
    </section>
  );
}
