import { gridStyle, SectionHead, SectionShell, SiteImage, SiteLink } from "../primitives.tsx";
import type { SectionOf } from "../types.ts";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export default function TeamSection({ section }: { section: SectionOf<"team"> }) {
  const { data } = section;
  return (
    <SectionShell sectionId={section.id} settings={section.settings} className="wb-team" label={data.heading}>
      <SectionHead heading={data.heading} intro={data.intro} />
      <ul className="wb-grid" style={gridStyle(data.columns, data.mobileColumns)}>
        {data.members.map((member, index) => (
          <li key={index} className="wb-member">
            {member.photo ? (
              <SiteImage image={member.photo} className="wb-member-photo" />
            ) : (
              <span className="wb-member-photo wb-member-initials" aria-hidden="true">
                {initials(member.name)}
              </span>
            )}
            <h3>{member.name}</h3>
            {member.role && <p className="wb-member-role">{member.role}</p>}
            {member.bio && <p className="wb-muted">{member.bio}</p>}
            {member.link && <SiteLink link={member.link} className="wb-member-link" />}
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
