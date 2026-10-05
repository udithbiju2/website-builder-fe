import { gridStyle, SectionHead, SectionShell, SiteButton, SiteIcon } from "../primitives.tsx";
import type { GridColumns, SectionOf } from "../types.ts";

export default function PricingSection({ section }: { section: SectionOf<"pricing"> }) {
  const { data } = section;
  const columns = Math.min(Math.max(data.plans.length, 1), 4) as GridColumns;
  return (
    <SectionShell sectionId={section.id} settings={section.settings} className="wb-pricing" label={data.heading}>
      <SectionHead heading={data.heading} intro={data.intro} />
      <div className="wb-grid" style={gridStyle(columns, 1)}>
        {data.plans.map((plan, index) => (
          <article key={index} className={`wb-card wb-plan${plan.featured ? " wb-plan-featured" : ""}`}>
            {plan.featured && <p className="wb-plan-badge">Most popular</p>}
            <h3>{plan.name}</h3>
            <p className="wb-plan-price">
              <strong>{plan.price}</strong>
              {plan.period && <span className="wb-muted"> {plan.period}</span>}
            </p>
            {plan.description && <p>{plan.description}</p>}
            {plan.features.length > 0 && (
              <ul className="wb-plan-features">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>
                    <SiteIcon name="check" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}
            {plan.cta && (
              <div className="wb-plan-cta">
                <SiteButton link={plan.cta} tone={plan.featured ? "primary" : "secondary"} />
              </div>
            )}
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
