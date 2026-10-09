import { createRoot } from "react-dom/client";
import "../src/site-kit/fonts.css";
import { DEFAULT_THEME, SECTION_PRESETS, SectionView, SiteFrame, SiteStyles } from "../src/site-kit/index.ts";

const params = new URLSearchParams(location.search);
const only = params.get("p");
const presets = SECTION_PRESETS.filter((p) => p.type === "auth" && (!only || p.key === only));
const theme = { ...DEFAULT_THEME, colors: { ...DEFAULT_THEME.colors, primary: "#3b5bdb", secondary: "#a855f7" }, fonts: { heading: "plus-jakarta-sans", body: "inter" } } as typeof DEFAULT_THEME;

createRoot(document.getElementById("root")!).render(
  <>
    <SiteStyles />
    {presets.map((p) => (
      <div key={p.key} id={p.key}>
        <div className="lbl">{p.label}</div>
        <SiteFrame theme={theme} header={null} footer={null}>
          <SectionView section={p.create()} />
        </SiteFrame>
      </div>
    ))}
  </>,
);
