import type {
  ContactData,
  CtaData,
  FaqData,
  FeatureItem,
  FeaturesData,
  FontKey,
  GalleryData,
  GridColumns,
  HeroData,
  IconName,
  LogosData,
  MediaData,
  PricingData,
  PricingPlan,
  Section,
  SectionAlign,
  SectionBackground,
  SectionSettings,
  SectionSpacing,
  ServicesData,
  SplitData,
  StatsData,
  TeamData,
  TeamMember,
  TestimonialsData,
  TextData,
} from "../../../site-kit/index.ts";
import {
  CheckboxField,
  ColorField,
  FormGroup,
  ImageField,
  ItemList,
  LinkField,
  OptionalLinkField,
  SelectField,
  TextAreaField,
  TextField,
} from "./fields.tsx";
import { FontPicker } from "./FontPicker.tsx";

type DataFormProps<T> = { data: T; onChange: (data: T) => void };

const COLUMN_OPTIONS: { value: GridColumns; label: string }[] = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
];

const ICON_OPTIONS: { value: IconName | ""; label: string }[] = [
  { value: "", label: "No icon" },
  { value: "gear", label: "Settings / Gear ⚙️" },
  { value: "user", label: "User / Profile 👤" },
  { value: "mail", label: "Mail / Contact ✉️" },
  { value: "phone", label: "Phone / Callback 📞" },
  { value: "chart", label: "Chart / Analytics 📊" },
  { value: "clock", label: "Clock / Real-time ⏱️" },
  { value: "tools", label: "Tools / Wrench 🛠️" },
  { value: "bell", label: "Bell / Notification 🔔" },
  { value: "wallet", label: "Wallet / Cost 💳" },
  { value: "pointer", label: "Pointer / Interactive 👆" },
  { value: "help", label: "Help / Support ❓" },
  { value: "sparkles", label: "Sparkles / AI ✨" },
  { value: "rocket", label: "Rocket / Speed 🚀" },
  { value: "layers", label: "Layers / Stack 🥞" },
  { value: "box", label: "Box / Package 📦" },
  { value: "lock", label: "Lock / Security 🔒" },
  { value: "cloud", label: "Cloud / Sync ☁️" },
  { value: "code", label: "Code / API 💻" },
  { value: "check", label: "Checkmark ✓" },
  { value: "star", label: "Star ★" },
  { value: "bolt", label: "Lightning ⚡" },
  { value: "shield", label: "Shield 🛡️" },
  { value: "heart", label: "Heart ❤️" },
  { value: "chat", label: "Chat 💬" },
];

const FEATURE_COLOR_OPTIONS = [
  { value: "default", label: "Auto (Palette cycled)" },
  { value: "none", label: "None / Neutral (No color tint)" },
  { value: "gray", label: "Gray / Slate" },
  { value: "orange", label: "Orange" },
  { value: "green", label: "Green" },
  { value: "blue", label: "Blue" },
  { value: "yellow", label: "Yellow" },
  { value: "cyan", label: "Cyan" },
  { value: "purple", label: "Purple" },
  { value: "pink", label: "Pink" },
  { value: "indigo", label: "Indigo" },
  { value: "red", label: "Red" },
];

const FEATURE_CARD_BG_PRESETS = [
  { value: "", label: "Default section theme" },
  { value: "#ffffff", label: "Pure White (#ffffff)" },
  { value: "#f8fafc", label: "Light Slate (#f8fafc)" },
  { value: "#f1f5f9", label: "Soft Gray (#f1f5f9)" },
  { value: "#fff7ed", label: "Soft Orange tint (#fff7ed)" },
  { value: "#f0fdf4", label: "Soft Green tint (#f0fdf4)" },
  { value: "#eff6ff", label: "Soft Blue tint (#eff6ff)" },
  { value: "#fefce8", label: "Soft Yellow tint (#fefce8)" },
  { value: "#faf5ff", label: "Soft Purple tint (#faf5ff)" },
  { value: "#fdf2f8", label: "Soft Pink tint (#fdf2f8)" },
  { value: "#0f172a", label: "Dark Slate (#0f172a)" },
];

const BACKGROUND_OPTIONS: { value: SectionBackground; label: string }[] = [
  { value: "default", label: "Page background" },
  { value: "surface", label: "Tinted" },
  { value: "primary", label: "Primary colour" },
  { value: "dark", label: "Dark" },
];

const SPACING_OPTIONS: { value: SectionSpacing; label: string }[] = [
  { value: "default", label: "Theme default" },
  { value: "none", label: "None" },
  { value: "compact", label: "Compact" },
  { value: "relaxed", label: "Relaxed" },
];

const ALIGN_OPTIONS: { value: SectionAlign; label: string }[] = [
  { value: "center", label: "Centered" },
  { value: "left", label: "Left aligned" },
];

const ANCHOR_PATTERN = /^[a-z][a-z0-9-]{0,39}$/;

/** Short repeatable text lines such as bullets or plan features. */
function StringList({
  label,
  items,
  max,
  onChange,
  addLabel,
}: {
  label: string;
  items: string[];
  max: number;
  onChange: (items: string[]) => void;
  addLabel: string;
}) {
  return (
    <ItemList<string>
      label={label}
      items={items}
      max={max}
      onChange={onChange}
      create={() => "New item"}
      itemTitle={(item) => item}
      addLabel={addLabel}
      renderItem={(item, update) => (
        <TextField
          label="Text"
          value={item}
          onChange={update}
          maxLength={200}
          required
        />
      )}
    />
  );
}

function ColumnsFields<
  T extends { columns: GridColumns; mobileColumns: GridColumns },
>({ data, onChange }: DataFormProps<T>) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <SelectField
        label="Columns"
        value={data.columns}
        options={COLUMN_OPTIONS}
        onChange={(columns) => onChange({ ...data, columns })}
      />
      <SelectField
        label="On mobile"
        value={data.mobileColumns}
        options={COLUMN_OPTIONS.slice(0, 2)}
        onChange={(mobileColumns) => onChange({ ...data, mobileColumns })}
      />
    </div>
  );
}

function HeroForm({ data, onChange }: DataFormProps<HeroData>) {
  const trustedBy = data.trustedBy ?? {};
  const updateTrustedBy = (
    patch: Partial<NonNullable<HeroData["trustedBy"]>>,
  ) => {
    onChange({ ...data, trustedBy: { ...trustedBy, ...patch } });
  };

  return (
    <>
      <FormGroup title="Hero style & layout">
        <SelectField
          label="Hero design style"
          value={data.variant === "split-left" ? "split" : data.variant}
          options={[
            {
              value: "centered",
              label: "Centered (Heading, dual CTAs, visual showcase)",
            },
            { value: "split", label: "Split screen (Side-by-side headline & media mockup)" },
            {
              value: "gradient",
              label: "Vibrant gradient (Mesh glow & trusted logos)",
            },
            {
              value: "soft-card",
              label: "Soft card showcase (Elevated container card)",
            },
            {
              value: "curved-bottom",
              label: "Curved wave bottom (Smooth SVG wave divider)",
            },
            {
              value: "minimal-typography",
              label: "Minimal bold typography (Oversized headline)",
            },
            {
              value: "asymmetric",
              label: "Asymmetric layout (Modern angled mockup)",
            },
            {
              value: "background-image",
              label: "Background image overlay (Full atmosphere)",
            },
            {
              value: "video-bg",
              label: "Video background & demo (Cinematic video player)",
            },
          ]}
          onChange={(variant) =>
            onChange({ ...data, variant: variant as HeroData["variant"] })
          }
        />
        {(data.variant === "split" ||
          data.variant === "split-left" ||
          data.imagePosition === "left" ||
          data.imagePosition === "right") && (
          <SelectField
            label="Media position (Left / Right)"
            value={
              data.variant === "split-left" || data.imagePosition === "left"
                ? "left"
                : "right"
            }
            options={[
              {
                value: "right",
                label: "Right side (Headline on left, mockup on right)",
              },
              {
                value: "left",
                label: "Left side (Mockup on left, headline on right)",
              },
            ]}
            onChange={(side) =>
              onChange({
                ...data,
                variant: side === "left" ? "split-left" : "split",
                imagePosition: side as "left" | "right",
              })
            }
            hint="Switch mockup and visual placement between the left and right side."
          />
        )}
        <SelectField
          label="Section height"
          value={data.minHeight ?? "auto"}
          options={[
            { value: "auto", label: "Auto (Follow content & padding)" },
            { value: "screen", label: "Full screen (100vh viewport height)" },
            { value: "tall", label: "Tall (700px spacious)" },
            { value: "compact", label: "Compact (Minimal vertical padding)" },
          ]}
          onChange={(minHeight) =>
            onChange({ ...data, minHeight: minHeight as HeroData["minHeight"] })
          }
        />
        <SelectField
          label="Bottom shape divider"
          value={data.bottomShape ?? "none"}
          options={[
            { value: "none", label: "None (Straight border)" },
            { value: "wave", label: "Smooth wave" },
            { value: "curve", label: "Convex curve" },
            { value: "slant", label: "Angled slant" },
            { value: "tilt", label: "Gentle tilt" },
          ]}
          onChange={(bottomShape) =>
            onChange({
              ...data,
              bottomShape: bottomShape as HeroData["bottomShape"],
            })
          }
        />
      </FormGroup>

      <FormGroup title="Headings & copy">
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-1">
            <TextField
              label="Icon / Emoji"
              value={data.badgeIcon ?? ""}
              onChange={(badgeIcon) =>
                onChange({ ...data, badgeIcon: badgeIcon || undefined })
              }
              maxLength={10}
              placeholder="✨"
            />
          </div>
          <div className="col-span-2">
            <TextField
              label="Badge / Eyebrow"
              value={data.eyebrow ?? ""}
              onChange={(eyebrow) =>
                onChange({ ...data, eyebrow: eyebrow || undefined })
              }
              maxLength={200}
              placeholder="Next-Gen Platform"
            />
          </div>
        </div>

        <TextField
          label="Main heading (optional)"
          value={data.heading ?? ""}
          onChange={(heading) => onChange({ ...data, heading })}
          maxLength={200}
        />
        <TextField
          label="Gradient highlight text (optional)"
          value={data.highlightText ?? ""}
          onChange={(highlightText) =>
            onChange({ ...data, highlightText: highlightText || undefined })
          }
          maxLength={100}
          hint="Matching word in heading will render with a colorful vibrant gradient."
          placeholder="faster"
        />
        <TextAreaField
          label="Subheading / Summary"
          value={data.subheading ?? ""}
          onChange={(subheading) =>
            onChange({ ...data, subheading: subheading || undefined })
          }
          maxLength={500}
          rows={2}
        />
        <TextAreaField
          label="Extended description (optional)"
          value={data.description ?? ""}
          onChange={(description) =>
            onChange({ ...data, description: description || undefined })
          }
          maxLength={1000}
          rows={2}
        />
      </FormGroup>

      <FormGroup title="Action buttons (CTAs)">
        <OptionalLinkField
          label="Primary button (CTA)"
          value={data.primaryCta}
          onChange={(primaryCta) => onChange({ ...data, primaryCta })}
          fallback={{ label: "Get started", href: "/signup" }}
        />
        <OptionalLinkField
          label="Secondary button"
          value={data.secondaryCta}
          onChange={(secondaryCta) => onChange({ ...data, secondaryCta })}
          fallback={{ label: "Book a demo", href: "/demo" }}
        />
        <OptionalLinkField
          label="Play video / Demo button (optional)"
          value={data.tertiaryCta}
          onChange={(tertiaryCta) => onChange({ ...data, tertiaryCta })}
          fallback={{ label: "Watch 2-min demo", href: "#demo" }}
        />
      </FormGroup>

      <FormGroup title="Foreground media / visual">
        <SelectField
          label="Foreground media type"
          value={data.mediaType ?? (data.videoUrl ? "video" : "image")}
          options={[
            { value: "image", label: "Image showcase / Mockup" },
            { value: "video", label: "Playable video demo (MP4 / YouTube / Vimeo)" },
            { value: "both", label: "Interactive video with poster image" },
          ]}
          onChange={(mediaType) =>
            onChange({ ...data, mediaType: mediaType as HeroData["mediaType"] })
          }
        />

        <SelectField
          label="Media display placement"
          value={
            data.imagePosition ??
            (data.variant === "split"
              ? "right"
              : data.variant === "split-left"
                ? "left"
                : data.variant === "background-image" || data.variant === "video-bg"
                  ? "background"
                  : "bottom")
          }
          options={[
            {
              value: "right",
              label: "Split right (Headline left, media on right)",
            },
            {
              value: "left",
              label: "Split left (Media on left, headline right)",
            },
            {
              value: "bottom",
              label: "Foreground showcase card / player (Below CTA buttons)",
            },
            {
              value: "background",
              label: "Full background cover (Edge-to-edge behind text)",
            },
          ]}
          onChange={(imagePosition) => {
            const pos = imagePosition as HeroData["imagePosition"];
            let variant = data.variant;
            if (pos === "left") variant = "split-left";
            else if (pos === "right" && data.variant === "split-left") variant = "split";
            onChange({
              ...data,
              imagePosition: pos,
              variant,
            });
          }}
          hint="Choose whether your media is positioned side-by-side (left/right), below headline/CTAs, or fills the background."
        />

        <ImageField
          label={
            data.mediaType === "both"
              ? "Video poster / thumbnail image (optional)"
              : "Main hero image / mockup (optional)"
          }
          value={data.image}
          onChange={(image) => onChange({ ...data, image })}
          optional
        />

        <SelectField
          label="Image / media style"
          value={data.imageStyle ?? "plain"}
          options={[
            { value: "plain", label: "Standard rounded corners" },
            {
              value: "mockup",
              label: "Browser mockup window (with macOS 3-dots & shadow)",
            },
            { value: "glow", label: "Ambient glow backlight" },
            { value: "rounded", label: "Soft pill corners" },
          ]}
          onChange={(imageStyle) =>
            onChange({
              ...data,
              imageStyle: imageStyle as HeroData["imageStyle"],
            })
          }
        />

        <TextField
          label="Playable video URL (optional)"
          value={data.videoUrl ?? ""}
          onChange={(videoUrl) =>
            onChange({ ...data, videoUrl: videoUrl || undefined })
          }
          maxLength={500}
          placeholder="https://www.youtube.com/watch?v=... or https://.../demo.mp4"
          hint="Supports YouTube, Vimeo, or direct MP4/WebM video URLs."
        />

        {Boolean(data.videoUrl) && (
          <div className="flex flex-col gap-2 pt-1">
            <CheckboxField
              label="Show video player controls"
              checked={data.videoControls ?? true}
              onChange={(videoControls) =>
                onChange({ ...data, videoControls })
              }
            />
            <CheckboxField
              label="Autoplay video (muted)"
              checked={Boolean(data.videoAutoplay)}
              onChange={(videoAutoplay) =>
                onChange({ ...data, videoAutoplay })
              }
            />
            <CheckboxField
              label="Loop video continuously"
              checked={Boolean(data.videoLoop)}
              onChange={(videoLoop) => onChange({ ...data, videoLoop })}
            />
          </div>
        )}
      </FormGroup>

      <FormGroup title="Full background media & cover (Image / Video)">
        <ImageField
          label="Background image (full-bleed cover)"
          value={data.backgroundImage}
          onChange={(backgroundImage) =>
            onChange({ ...data, backgroundImage })
          }
          optional
        />

        <SelectField
          label="Background image alignment / position"
          value={data.bgImagePosition ?? "cover"}
          options={[
            { value: "cover", label: "Center cover (Full bleed background)" },
            { value: "top", label: "Top aligned" },
            { value: "center", label: "Centered" },
          ]}
          onChange={(bgImagePosition) =>
            onChange({
              ...data,
              bgImagePosition: bgImagePosition as HeroData["bgImagePosition"],
            })
          }
        />

        <TextField
          label="Background video URL (YouTube, Vimeo, MP4/WebM)"
          value={data.backgroundVideoUrl ?? (data.variant === "video-bg" || data.imagePosition === "background" ? data.videoUrl ?? "" : "")}
          onChange={(backgroundVideoUrl) =>
            onChange({ ...data, backgroundVideoUrl: backgroundVideoUrl || undefined })
          }
          maxLength={500}
          placeholder="https://www.youtube.com/watch?v=... or https://.../ambient.mp4"
          hint="Ambient full-bleed video that plays automatically in the background."
        />

        <SelectField
          label="Background overlay style"
          value={data.bgOverlayType ?? "gradient"}
          options={[
            {
              value: "gradient",
              label: "Soft top-to-bottom fade (Keeps top text crystal clear)",
            },
            { value: "dark", label: "Dark tint overlay" },
            { value: "light", label: "Light tint overlay" },
            { value: "none", label: "No overlay (Raw image/video)" },
          ]}
          onChange={(bgOverlayType) =>
            onChange({
              ...data,
              bgOverlayType: bgOverlayType as HeroData["bgOverlayType"],
            })
          }
        />

        {(data.bgOverlayType === "dark" || data.bgOverlayType === "light") && (
          <TextField
            label="Overlay opacity (0 - 100%)"
            type="number"
            value={String(data.overlayOpacity ?? 50)}
            onChange={(val) =>
              onChange({
                ...data,
                overlayOpacity: Math.min(
                  100,
                  Math.max(0, parseInt(val, 10) || 0),
                ),
              })
            }
          />
        )}

        <CheckboxField
          label="Enable glassmorphism background blur"
          checked={Boolean(data.overlayBlur)}
          onChange={(overlayBlur) => onChange({ ...data, overlayBlur })}
        />
      </FormGroup>



      <FormGroup title="Trusted by logo strip">
        <CheckboxField
          label="Show trusted by brand logos"
          checked={Boolean(
            data.trustedBy?.logos?.length || data.trustedBy?.label,
          )}
          onChange={(checked) =>
            onChange({
              ...data,
              trustedBy: checked
                ? {
                    label: "Trusted by forward-thinking teams worldwide",
                    logos: [
                      { label: "Acme Corp" },
                      { label: "HyperScale" },
                      { label: "Vortex Labs" },
                    ],
                  }
                : undefined,
            })
          }
        />
        {Boolean(data.trustedBy) && (
          <div className="flex flex-col gap-2.5 pt-1">
            <TextField
              label="Strip label"
              value={trustedBy.label ?? ""}
              onChange={(label) =>
                updateTrustedBy({ label: label || undefined })
              }
              maxLength={100}
              placeholder="Trusted by over 10,000+ companies"
            />
            <TextField
              label="Company brand names (comma separated)"
              value={(trustedBy.logos ?? []).map((l) => l.label).join(", ")}
              onChange={(val) =>
                updateTrustedBy({
                  logos: val
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((label) => ({ label })),
                })
              }
            />
          </div>
        )}
      </FormGroup>
    </>
  );
}

function FeaturesForm({ data, onChange }: DataFormProps<FeaturesData>) {
  const isSplit = data.variant === "split";

  return (
    <>
      <FormGroup title="Features layout & style">
        <SelectField
          label="Layout variant"
          value={data.variant ?? "grid"}
          options={[
            {
              value: "grid",
              label: "Standard responsive grid (Cards & icons)",
            },
            {
              value: "split",
              label: "Split screen showcase (Headline + mockup on one side, stacked cards on other)",
            },
            {
              value: "pastel-icons",
              label: "Pastel icon highlights (Soft circular badges with clean typography)",
            },
            {
              value: "minimal",
              label: "Minimal clean grid (Modern accent icons, borderless)",
            },
            {
              value: "cards",
              label: "Elevated modern cards (Surface cards with hover lift & subtle shadow)",
            },
          ]}
          onChange={(variant) =>
            onChange({
              ...data,
              variant: variant as FeaturesData["variant"],
            })
          }
        />

        {isSplit && (
          <>
            <SelectField
              label="Split layout alignment"
              value={data.splitPosition ?? "left"}
              options={[
                {
                  value: "left",
                  label: "Visual & headline on Left, Feature cards on Right",
                },
                {
                  value: "right",
                  label: "Feature cards on Left, Visual & headline on Right",
                },
              ]}
              onChange={(pos) =>
                onChange({
                  ...data,
                  splitPosition: pos as "left" | "right",
                })
              }
              hint="Easily flip the visual showcase and feature card stack between left and right."
            />
            <ImageField
              label="Custom mockup image (optional, default isometric 3D chart is used if empty)"
              value={data.splitImage}
              onChange={(splitImage) => onChange({ ...data, splitImage })}
              optional
            />
            <OptionalLinkField
              label="Primary CTA button (optional)"
              value={data.splitCta}
              onChange={(splitCta) => onChange({ ...data, splitCta })}
              fallback={{ label: "Explore more", href: "/features" }}
            />
            <OptionalLinkField
              label="Secondary CTA button (optional)"
              value={data.secondaryCta}
              onChange={(secondaryCta) => onChange({ ...data, secondaryCta })}
              fallback={{ label: "Book a demo", href: "/demo" }}
            />
          </>
        )}

        <SelectField
          label="Icon badge style"
          value={data.iconStyle ?? (data.variant === "pastel-icons" ? "pastel-circle" : isSplit ? "square-badge" : data.variant === "minimal" ? "minimal-accent" : "pastel-circle")}
          options={[
            {
              value: "pastel-circle",
              label: "Pastel circular badges (Soft tinted round backgrounds)",
            },
            {
              value: "square-badge",
              label: "Modern rounded squircle (Subtle border and tinted surface)",
            },
            {
              value: "minimal-accent",
              label: "Minimal clean icon (Brand color with no background box)",
            },
            {
              value: "colored-circle",
              label: "Solid / gradient colored circle",
            },
            { value: "none", label: "Hide icons" },
          ]}
          onChange={(iconStyle) =>
            onChange({
              ...data,
              iconStyle: iconStyle as FeaturesData["iconStyle"],
            })
          }
        />

        <SelectField
          label="Card container style"
          value={data.cardStyle ?? (data.variant === "cards" ? "surface" : data.variant === "minimal" || data.variant === "pastel-icons" ? "transparent" : "surface")}
          options={[
            { value: "transparent", label: "Transparent / Flat (No background box)" },
            { value: "surface", label: "Surface card (Tinted background & soft hover)" },
            { value: "bordered", label: "Subtle outlined border" },
            { value: "glass", label: "Glassmorphism (Frosted glass blur & soft border)" },
          ]}
          onChange={(cardStyle) =>
            onChange({
              ...data,
              cardStyle: cardStyle as FeaturesData["cardStyle"],
            })
          }
        />

        <SelectField
          label="Content alignment"
          value={data.align ?? (isSplit ? "left" : "center")}
          options={[
            { value: "center", label: "Center aligned" },
            { value: "left", label: "Left aligned" },
          ]}
          onChange={(align) =>
            onChange({
              ...data,
              align: align as "left" | "center",
            })
          }
        />
      </FormGroup>

      <FormGroup title="Headings & copy">
        <TextField
          label="Badge / Eyebrow (optional)"
          value={data.eyebrow ?? ""}
          onChange={(eyebrow) =>
            onChange({ ...data, eyebrow: eyebrow || undefined })
          }
          maxLength={100}
          placeholder="Capabilities"
        />
        <TextField
          label="Main heading"
          value={data.heading}
          onChange={(heading) => onChange({ ...data, heading })}
          maxLength={200}
          required
        />
        <TextAreaField
          label="Intro description (optional)"
          value={data.intro ?? ""}
          onChange={(intro) =>
            onChange({ ...data, intro: intro || undefined })
          }
          maxLength={500}
        />

        {!isSplit && <ColumnsFields data={data} onChange={onChange} />}

        {!isSplit && (
          <OptionalLinkField
            label="Bottom link / CTA (optional)"
            value={data.bottomCta}
            onChange={(bottomCta) => onChange({ ...data, bottomCta })}
            fallback={{ label: "Learn more", href: "/features" }}
          />
        )}
      </FormGroup>

      <FormGroup title="Feature items">
        <ItemList<FeaturesData["items"][number]>
          label="Items"
          items={data.items}
          max={24}
          onChange={(items) => onChange({ ...data, items })}
          create={() => ({
            icon: "gear",
            iconColor: "orange",
            title: "New feature",
            description: "Describe this benefit clearly.",
          })}
          itemTitle={(item) => item.title}
          addLabel="Add feature"
          renderItem={(item, update) => (
            <>
              <div className="grid grid-cols-2 gap-2">
                <SelectField
                  label="Icon"
                  value={item.icon ?? ""}
                  options={ICON_OPTIONS}
                  onChange={(icon) =>
                    update({ ...item, icon: icon || undefined })
                  }
                />
                <SelectField
                  label="Icon color badge"
                  value={item.iconColor ?? "default"}
                  options={FEATURE_COLOR_OPTIONS}
                  onChange={(color) =>
                    update({
                      ...item,
                      iconColor:
                        color === "default"
                          ? undefined
                          : (color as FeatureItem["iconColor"]),
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-2 items-end">
                <SelectField
                  label="Card background"
                  value={item.backgroundColor ?? ""}
                  options={[
                    ...FEATURE_CARD_BG_PRESETS,
                    ...(item.backgroundColor &&
                    !FEATURE_CARD_BG_PRESETS.some(
                      (p) =>
                        p.value.toLowerCase() ===
                        item.backgroundColor?.toLowerCase(),
                    )
                      ? [
                          {
                            value: item.backgroundColor,
                            label: `Custom (${item.backgroundColor})`,
                          },
                        ]
                      : []),
                  ]}
                  onChange={(val) =>
                    update({ ...item, backgroundColor: val || undefined })
                  }
                />
                <div className="pb-0.5">
                  <ColorField
                    label="Custom card background"
                    value={item.backgroundColor}
                    onChange={(color) =>
                      update({ ...item, backgroundColor: color || undefined })
                    }
                    fallback="#ffffff"
                  />
                </div>
              </div>
              <TextField
                label="Title"
                value={item.title}
                onChange={(title) => update({ ...item, title })}
                maxLength={120}
                required
              />
              <TextAreaField
                label="Description"
                value={item.description}
                onChange={(description) => update({ ...item, description })}
                maxLength={600}
              />
              <TextField
                label="Item badge / Tag (optional)"
                value={item.badge ?? ""}
                onChange={(badge) =>
                  update({ ...item, badge: badge || undefined })
                }
                maxLength={30}
                placeholder="New"
              />
              <OptionalLinkField
                label="Item link (optional)"
                value={item.link}
                onChange={(link) => update({ ...item, link })}
                fallback={{ label: "Learn more", href: "#" }}
              />
            </>
          )}
        />
      </FormGroup>
    </>
  );
}

function ServicesForm({ data, onChange }: DataFormProps<ServicesData>) {
  return (
    <>
      <FormGroup title="Content">
        <TextField
          label="Heading"
          value={data.heading}
          onChange={(heading) => onChange({ ...data, heading })}
          maxLength={200}
          required
        />
        <TextAreaField
          label="Intro"
          value={data.intro}
          onChange={(intro) => onChange({ ...data, intro })}
          maxLength={500}
        />
        <ColumnsFields data={data} onChange={onChange} />
      </FormGroup>
      <FormGroup title="Services">
        <ItemList<ServicesData["items"][number]>
          label="Items"
          items={data.items}
          max={24}
          onChange={(items) => onChange({ ...data, items })}
          create={() => ({
            title: "New service",
            description: "A short description of this service.",
          })}
          itemTitle={(item) => item.title}
          addLabel="Add service"
          renderItem={(item, update) => (
            <>
              <TextField
                label="Title"
                value={item.title}
                onChange={(title) => update({ ...item, title })}
                maxLength={120}
                required
              />
              <TextAreaField
                label="Description"
                value={item.description}
                onChange={(description) => update({ ...item, description })}
                maxLength={600}
              />
              <ImageField
                label="Image"
                value={item.image}
                onChange={(image) => update({ ...item, image })}
                optional
              />
              <OptionalLinkField
                label="Link"
                value={item.link}
                onChange={(link) => update({ ...item, link })}
                fallback={{ label: "Learn more", href: "/contact" }}
              />
            </>
          )}
        />
      </FormGroup>
    </>
  );
}

function TestimonialsForm({ data, onChange }: DataFormProps<TestimonialsData>) {
  return (
    <>
      <FormGroup title="Content">
        <TextField
          label="Heading"
          value={data.heading}
          onChange={(heading) => onChange({ ...data, heading })}
          maxLength={200}
          required
        />
      </FormGroup>
      <FormGroup title="Quotes">
        <ItemList<TestimonialsData["items"][number]>
          label="Testimonials"
          items={data.items}
          max={24}
          onChange={(items) => onChange({ ...data, items })}
          create={() => ({
            quote: "Add a short quote from a happy customer.",
            name: "Customer name",
          })}
          itemTitle={(item) => item.name}
          addLabel="Add testimonial"
          renderItem={(item, update) => (
            <>
              <TextAreaField
                label="Quote"
                value={item.quote}
                onChange={(quote) => update({ ...item, quote })}
                maxLength={800}
                required
              />
              <TextField
                label="Name"
                value={item.name}
                onChange={(name) => update({ ...item, name })}
                maxLength={120}
                required
              />
              <TextField
                label="Role or company"
                value={item.role}
                onChange={(role) => update({ ...item, role })}
                maxLength={120}
              />
            </>
          )}
        />
      </FormGroup>
    </>
  );
}

function FaqForm({ data, onChange }: DataFormProps<FaqData>) {
  return (
    <>
      <FormGroup title="Content">
        <TextField
          label="Heading"
          value={data.heading}
          onChange={(heading) => onChange({ ...data, heading })}
          maxLength={200}
          required
        />
        <TextAreaField
          label="Intro"
          value={data.intro}
          onChange={(intro) => onChange({ ...data, intro })}
          maxLength={500}
        />
      </FormGroup>
      <FormGroup title="Questions">
        <ItemList
          label="Questions"
          items={data.items}
          max={40}
          onChange={(items) => onChange({ ...data, items })}
          create={() => ({
            question: "New question?",
            answer: "Answer it clearly in a sentence or two.",
          })}
          itemTitle={(item) => item.question}
          addLabel="Add question"
          renderItem={(item, update) => (
            <>
              <TextField
                label="Question"
                value={item.question}
                onChange={(question) => update({ ...item, question })}
                maxLength={300}
                required
              />
              <TextAreaField
                label="Answer"
                value={item.answer}
                onChange={(answer) => update({ ...item, answer })}
                maxLength={2000}
                required
                rows={4}
              />
            </>
          )}
        />
      </FormGroup>
    </>
  );
}

function CtaForm({ data, onChange }: DataFormProps<CtaData>) {
  return (
    <FormGroup title="Content">
      <TextField
        label="Heading"
        value={data.heading}
        onChange={(heading) => onChange({ ...data, heading })}
        maxLength={200}
        required
      />
      <TextAreaField
        label="Text"
        value={data.text}
        onChange={(text) => onChange({ ...data, text })}
        maxLength={500}
      />
      <LinkField
        label="Button"
        value={data.button}
        onChange={(button) => onChange({ ...data, button })}
      />
    </FormGroup>
  );
}

function ContactForm({ data, onChange }: DataFormProps<ContactData>) {
  return (
    <>
      <FormGroup title="Content">
        <TextField
          label="Heading"
          value={data.heading}
          onChange={(heading) => onChange({ ...data, heading })}
          maxLength={200}
          required
        />
        <TextAreaField
          label="Text"
          value={data.text}
          onChange={(text) => onChange({ ...data, text })}
          maxLength={500}
        />
      </FormGroup>
      <FormGroup title="Contact details">
        <TextField
          label="Email"
          type="email"
          value={data.email}
          onChange={(email) => onChange({ ...data, email })}
          maxLength={255}
        />
        <TextField
          label="Phone"
          type="tel"
          value={data.phone}
          onChange={(phone) => onChange({ ...data, phone })}
          maxLength={32}
        />
        <TextAreaField
          label="Address"
          value={data.address}
          onChange={(address) => onChange({ ...data, address })}
          maxLength={500}
          rows={2}
        />
      </FormGroup>
      <FormGroup title="Form">
        <CheckboxField
          label="Show enquiry form"
          checked={data.showForm}
          onChange={(showForm) => onChange({ ...data, showForm })}
          hint="Form submissions are switched on when the site is published."
        />
        {data.showForm && (
          <TextField
            label="Button text"
            value={data.submitLabel}
            onChange={(submitLabel) => onChange({ ...data, submitLabel })}
            maxLength={40}
            required
          />
        )}
      </FormGroup>
    </>
  );
}

function TextForm({ data, onChange }: DataFormProps<TextData>) {
  return (
    <FormGroup title="Content">
      <TextField
        label="Heading"
        value={data.heading}
        onChange={(heading) => onChange({ ...data, heading })}
        maxLength={200}
      />
      <TextAreaField
        label="Text"
        value={data.body}
        onChange={(body) => onChange({ ...data, body })}
        rows={10}
        maxLength={20000}
        hint="Leave a blank line between paragraphs."
      />
    </FormGroup>
  );
}

function GalleryForm({ data, onChange }: DataFormProps<GalleryData>) {
  return (
    <>
      <FormGroup title="Content">
        <TextField
          label="Heading"
          value={data.heading}
          onChange={(heading) => onChange({ ...data, heading })}
          maxLength={200}
        />
        <ColumnsFields data={data} onChange={onChange} />
      </FormGroup>
      <FormGroup title="Images">
        <ItemList
          label="Images"
          items={data.images}
          max={48}
          onChange={(images) => onChange({ ...data, images })}
          create={() => ({ url: "", alt: "" })}
          itemTitle={(image, index) => image.alt || `Image ${index + 1}`}
          addLabel="Add image"
          renderItem={(image, update) => (
            <ImageField
              label="Image"
              value={image}
              onChange={(next) => update(next ?? { url: "", alt: "" })}
            />
          )}
        />
      </FormGroup>
    </>
  );
}

function LogosForm({ data, onChange }: DataFormProps<LogosData>) {
  return (
    <>
      <FormGroup title="Content">
        <TextField
          label="Heading"
          value={data.heading}
          onChange={(heading) => onChange({ ...data, heading })}
          maxLength={200}
        />
        <CheckboxField
          label="Show logos in grayscale"
          checked={data.grayscale}
          onChange={(grayscale) => onChange({ ...data, grayscale })}
        />
      </FormGroup>
      <FormGroup title="Logos">
        <ItemList
          label="Logos"
          items={data.logos}
          max={24}
          onChange={(logos) => onChange({ ...data, logos })}
          create={() => ({ url: "", alt: "" })}
          itemTitle={(logo, index) => logo.alt || `Logo ${index + 1}`}
          addLabel="Add logo"
          renderItem={(logo, update) => (
            <ImageField
              label="Logo"
              value={logo}
              onChange={(next) => update(next ?? { url: "", alt: "" })}
            />
          )}
        />
      </FormGroup>
    </>
  );
}

function SplitForm({ data, onChange }: DataFormProps<SplitData>) {
  return (
    <>
      <FormGroup title="Content">
        <TextField
          label="Small text above heading"
          value={data.eyebrow}
          onChange={(eyebrow) => onChange({ ...data, eyebrow })}
          maxLength={200}
        />
        <TextField
          label="Heading"
          value={data.heading}
          onChange={(heading) => onChange({ ...data, heading })}
          maxLength={200}
          required
        />
        <TextAreaField
          label="Text"
          value={data.body}
          onChange={(body) => onChange({ ...data, body })}
          maxLength={4000}
          rows={5}
          hint="Leave a blank line between paragraphs."
        />
        <StringList
          label="Bullet points"
          items={data.bullets}
          max={8}
          onChange={(bullets) => onChange({ ...data, bullets })}
          addLabel="Add bullet"
        />
        <OptionalLinkField
          label="Button"
          value={data.cta}
          onChange={(cta) => onChange({ ...data, cta })}
          fallback={{ label: "Learn more", href: "/contact" }}
        />
      </FormGroup>
      <FormGroup title="Image">
        <SelectField
          label="Image position"
          value={data.imagePosition}
          options={[
            { value: "right", label: "Right of the text" },
            { value: "left", label: "Left of the text" },
          ]}
          onChange={(imagePosition) => onChange({ ...data, imagePosition })}
        />
        <ImageField
          label="Image"
          value={data.image}
          onChange={(image) => onChange({ ...data, image })}
          optional
        />
      </FormGroup>
    </>
  );
}

function StatsForm({ data, onChange }: DataFormProps<StatsData>) {
  return (
    <>
      <FormGroup title="Content">
        <TextField
          label="Heading"
          value={data.heading}
          onChange={(heading) => onChange({ ...data, heading })}
          maxLength={200}
        />
        <TextAreaField
          label="Intro"
          value={data.intro}
          onChange={(intro) => onChange({ ...data, intro })}
          maxLength={500}
        />
      </FormGroup>
      <FormGroup title="Numbers">
        <ItemList
          label="Statistics"
          items={data.items}
          max={8}
          onChange={(items) => onChange({ ...data, items })}
          create={() => ({ value: "100", label: "Label" })}
          itemTitle={(item) => `${item.value} ${item.label}`}
          addLabel="Add statistic"
          renderItem={(item, update) => (
            <>
              <TextField
                label="Number"
                value={item.value}
                onChange={(value) => update({ ...item, value })}
                maxLength={20}
                required
              />
              <TextField
                label="Label"
                value={item.label}
                onChange={(label) => update({ ...item, label })}
                maxLength={80}
                required
              />
            </>
          )}
        />
      </FormGroup>
    </>
  );
}

function PricingForm({ data, onChange }: DataFormProps<PricingData>) {
  return (
    <>
      <FormGroup title="Content">
        <TextField
          label="Heading"
          value={data.heading}
          onChange={(heading) => onChange({ ...data, heading })}
          maxLength={200}
          required
        />
        <TextAreaField
          label="Intro"
          value={data.intro}
          onChange={(intro) => onChange({ ...data, intro })}
          maxLength={500}
        />
      </FormGroup>
      <FormGroup title="Plans">
        <ItemList<PricingPlan>
          label="Plans"
          items={data.plans}
          max={4}
          onChange={(plans) => onChange({ ...data, plans })}
          create={() => ({
            name: "New plan",
            price: "$0",
            period: "/ month",
            features: [],
            featured: false,
          })}
          itemTitle={(plan) => plan.name}
          addLabel="Add plan"
          renderItem={(plan, update) => (
            <>
              <TextField
                label="Name"
                value={plan.name}
                onChange={(name) => update({ ...plan, name })}
                maxLength={60}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="Price"
                  value={plan.price}
                  onChange={(price) => update({ ...plan, price })}
                  maxLength={20}
                  required
                />
                <TextField
                  label="Period"
                  value={plan.period}
                  onChange={(period) => update({ ...plan, period })}
                  maxLength={20}
                />
              </div>
              <TextAreaField
                label="Description"
                value={plan.description}
                onChange={(description) => update({ ...plan, description })}
                maxLength={300}
                rows={2}
              />
              <StringList
                label="Features"
                items={plan.features}
                max={12}
                onChange={(features) => update({ ...plan, features })}
                addLabel="Add feature"
              />
              <OptionalLinkField
                label="Button"
                value={plan.cta}
                onChange={(cta) => update({ ...plan, cta })}
                fallback={{ label: "Get started", href: "/contact" }}
              />
              <CheckboxField
                label="Highlight as most popular"
                checked={plan.featured}
                onChange={(featured) => update({ ...plan, featured })}
              />
            </>
          )}
        />
      </FormGroup>
    </>
  );
}

function MediaForm({ data, onChange }: DataFormProps<MediaData>) {
  return (
    <>
      <FormGroup title="Content">
        <SelectField
          label="Type"
          value={data.kind}
          options={[
            { value: "image", label: "Image" },
            { value: "video", label: "YouTube or Vimeo video" },
          ]}
          onChange={(kind) => onChange({ ...data, kind })}
        />
        <TextField
          label="Heading"
          value={data.heading}
          onChange={(heading) => onChange({ ...data, heading })}
          maxLength={200}
        />
        {data.kind === "image" ? (
          <ImageField
            label="Image"
            value={data.image}
            onChange={(image) => onChange({ ...data, image })}
            optional
          />
        ) : (
          <TextField
            label="Video link"
            type="url"
            value={data.videoUrl}
            onChange={(videoUrl) => onChange({ ...data, videoUrl })}
            placeholder="https://www.youtube.com/watch?v=…"
            hint="Plays with privacy-enhanced embedding."
            maxLength={2048}
          />
        )}
        <TextField
          label="Caption"
          value={data.caption}
          onChange={(caption) => onChange({ ...data, caption })}
          maxLength={300}
        />
      </FormGroup>
      <FormGroup title="Layout">
        <div className="grid grid-cols-2 gap-3">
          <SelectField
            label="Shape"
            value={data.aspect}
            options={[
              { value: "16:9", label: "Wide 16:9" },
              { value: "4:3", label: "Classic 4:3" },
              { value: "1:1", label: "Square" },
            ]}
            onChange={(aspect) => onChange({ ...data, aspect })}
          />
          <SelectField
            label="Width"
            value={data.width}
            options={[
              { value: "contained", label: "Contained" },
              { value: "wide", label: "Full width" },
            ]}
            onChange={(width) => onChange({ ...data, width })}
          />
        </div>
      </FormGroup>
    </>
  );
}

function TeamForm({ data, onChange }: DataFormProps<TeamData>) {
  return (
    <>
      <FormGroup title="Content">
        <TextField
          label="Heading"
          value={data.heading}
          onChange={(heading) => onChange({ ...data, heading })}
          maxLength={200}
          required
        />
        <TextAreaField
          label="Intro"
          value={data.intro}
          onChange={(intro) => onChange({ ...data, intro })}
          maxLength={500}
        />
        <ColumnsFields data={data} onChange={onChange} />
      </FormGroup>
      <FormGroup title="People">
        <ItemList<TeamMember>
          label="Members"
          items={data.members}
          max={24}
          onChange={(members) => onChange({ ...data, members })}
          create={() => ({ name: "New member", role: "Role" })}
          itemTitle={(member) => member.name}
          addLabel="Add person"
          renderItem={(member, update) => (
            <>
              <TextField
                label="Name"
                value={member.name}
                onChange={(name) => update({ ...member, name })}
                maxLength={120}
                required
              />
              <TextField
                label="Role"
                value={member.role}
                onChange={(role) => update({ ...member, role })}
                maxLength={120}
              />
              <TextAreaField
                label="Short bio"
                value={member.bio}
                onChange={(bio) => update({ ...member, bio })}
                maxLength={600}
                rows={2}
              />
              <ImageField
                label="Photo"
                value={member.photo}
                onChange={(photo) => update({ ...member, photo })}
                optional
              />
              <OptionalLinkField
                label="Link"
                value={member.link}
                onChange={(link) => update({ ...member, link })}
                fallback={{ label: "LinkedIn", href: "https://linkedin.com/" }}
              />
            </>
          )}
        />
      </FormGroup>
    </>
  );
}

type SettingsFormProps = {
  settings: SectionSettings;
  onChange: (settings: SectionSettings) => void;
};

export function SectionStyleForm({
  settings,
  siteFont,
  onChange,
}: SettingsFormProps & { siteFont: FontKey }) {
  const customColors = settings.customColors ?? {};
  const updateCustomColor = (
    patch: Partial<NonNullable<SectionSettings["customColors"]>>,
  ) => {
    const next = { ...customColors, ...patch };
    // Remove keys that are undefined
    const cleaned = Object.fromEntries(
      Object.entries(next).filter(([_, v]) => Boolean(v)),
    );
    onChange({
      ...settings,
      customColors: Object.keys(cleaned).length > 0 ? cleaned : undefined,
    });
  };

  const hasAnyCustomColors = Boolean(
    customColors.background ||
      customColors.text ||
      customColors.primary ||
      customColors.muted ||
      customColors.border,
  );

  return (
    <>
      <FormGroup title="Section layout & theme">
        <SelectField
          label="Theme preset background"
          value={settings.background}
          options={BACKGROUND_OPTIONS}
          onChange={(background) => onChange({ ...settings, background })}
        />
        <SelectField
          label="Vertical spacing"
          value={settings.spacing ?? "default"}
          options={SPACING_OPTIONS}
          onChange={(spacing) => onChange({ ...settings, spacing })}
        />
        <SelectField
          label="Heading alignment"
          value={settings.align ?? "center"}
          options={ALIGN_OPTIONS}
          onChange={(align) => onChange({ ...settings, align })}
        />
      </FormGroup>

      <FormGroup title="Section font">
        <FontPicker
          label="Section font"
          value={settings.font}
          inheritFrom={siteFont}
          onChange={(font) => {
            const { font: _previous, ...rest } = settings;
            onChange(font ? { ...rest, font } : rest);
          }}
        />
      </FormGroup>

      <FormGroup title="Custom dynamic colors (CellColorPicker)">
        <ColorField
          label="Section background"
          value={customColors.background}
          onChange={(background) => updateCustomColor({ background })}
          fallback="#ffffff"
          hint="Overrides the theme background for this specific section."
        />
        <ColorField
          label="Text / Heading color"
          value={customColors.text}
          onChange={(text) => updateCustomColor({ text })}
          fallback="#0f172a"
        />
        <ColorField
          label="Primary / Accent color"
          value={customColors.primary}
          onChange={(primary) => updateCustomColor({ primary })}
          fallback="#6366f1"
          hint="Used for CTA buttons, gradient highlights, and active elements."
        />
        <ColorField
          label="Muted / Subtitle text"
          value={customColors.muted}
          onChange={(muted) => updateCustomColor({ muted })}
          fallback="#64748b"
        />
        <ColorField
          label="Border & divider line"
          value={customColors.border}
          onChange={(border) => updateCustomColor({ border })}
          fallback="#e2e8f0"
        />

        {hasAnyCustomColors && (
          <button
            type="button"
            onClick={() => onChange({ ...settings, customColors: undefined })}
            className="mt-1 text-ed-xs text-ed-danger hover:underline font-medium self-start"
          >
            Reset all custom colors to theme default
          </button>
        )}
      </FormGroup>
    </>
  );
}

export function SectionResponsiveForm({
  settings,
  onChange,
}: SettingsFormProps) {
  return (
    <FormGroup title="Visibility by device">
      <CheckboxField
        label="Hide on mobile"
        hint="Screens narrower than 600px."
        checked={settings.hideOnMobile}
        onChange={(hideOnMobile) => onChange({ ...settings, hideOnMobile })}
      />
      <CheckboxField
        label="Hide on tablet and desktop"
        hint="Show this section on phones only."
        checked={settings.hideOnDesktop ?? false}
        onChange={(hideOnDesktop) => onChange({ ...settings, hideOnDesktop })}
      />
    </FormGroup>
  );
}

export function SectionAdvancedForm({ settings, onChange }: SettingsFormProps) {
  const anchor = settings.anchor ?? "";
  return (
    <FormGroup title="Anchor link">
      <TextField
        label="Section id"
        value={anchor}
        onChange={(value) =>
          onChange({ ...settings, anchor: value.toLowerCase() })
        }
        placeholder="pricing"
        maxLength={40}
        error={
          anchor && !ANCHOR_PATTERN.test(anchor)
            ? "Lowercase letters, numbers and hyphens, starting with a letter"
            : undefined
        }
        hint={
          anchor
            ? `Link to it with #${anchor}`
            : "Lets buttons and menu links jump to this section."
        }
      />
    </FormGroup>
  );
}

import { FooterForm, HeaderForm } from "./SiteSettingsForms.tsx";

export function SectionContentForm({
  section,
  onChange,
}: {
  section: Section;
  onChange: (section: Section) => void;
}) {
  return <DataForm section={section} onChange={onChange} />;
}

function DataForm({
  section,
  onChange,
}: {
  section: Section;
  onChange: (section: Section) => void;
}) {
  switch (section.type) {
    case "header":
      return (
        <HeaderForm
          header={section.data}
          onChange={(data) => onChange({ ...section, data })}
        />
      );
    case "footer":
      return (
        <FooterForm
          footer={section.data}
          onChange={(data) => onChange({ ...section, data })}
        />
      );
    case "hero":
      return (
        <HeroForm
          data={section.data}
          onChange={(data) => onChange({ ...section, data })}
        />
      );
    case "features":
      return (
        <FeaturesForm
          data={section.data}
          onChange={(data) => onChange({ ...section, data })}
        />
      );
    case "services":
      return (
        <ServicesForm
          data={section.data}
          onChange={(data) => onChange({ ...section, data })}
        />
      );
    case "testimonials":
      return (
        <TestimonialsForm
          data={section.data}
          onChange={(data) => onChange({ ...section, data })}
        />
      );
    case "faq":
      return (
        <FaqForm
          data={section.data}
          onChange={(data) => onChange({ ...section, data })}
        />
      );
    case "cta":
      return (
        <CtaForm
          data={section.data}
          onChange={(data) => onChange({ ...section, data })}
        />
      );
    case "contact":
      return (
        <ContactForm
          data={section.data}
          onChange={(data) => onChange({ ...section, data })}
        />
      );
    case "text":
      return (
        <TextForm
          data={section.data}
          onChange={(data) => onChange({ ...section, data })}
        />
      );
    case "gallery":
      return (
        <GalleryForm
          data={section.data}
          onChange={(data) => onChange({ ...section, data })}
        />
      );
    case "logos":
      return (
        <LogosForm
          data={section.data}
          onChange={(data) => onChange({ ...section, data })}
        />
      );
    case "split":
      return (
        <SplitForm
          data={section.data}
          onChange={(data) => onChange({ ...section, data })}
        />
      );
    case "stats":
      return (
        <StatsForm
          data={section.data}
          onChange={(data) => onChange({ ...section, data })}
        />
      );
    case "pricing":
      return (
        <PricingForm
          data={section.data}
          onChange={(data) => onChange({ ...section, data })}
        />
      );
    case "media":
      return (
        <MediaForm
          data={section.data}
          onChange={(data) => onChange({ ...section, data })}
        />
      );
    case "team":
      return (
        <TeamForm
          data={section.data}
          onChange={(data) => onChange({ ...section, data })}
        />
      );
  }
}

export default function SectionForm({
  section,
  siteFont,
  onChange,
}: {
  section: Section;
  siteFont: FontKey;
  onChange: (section: Section) => void;
}) {
  const changeSettings = (settings: SectionSettings) =>
    onChange({ ...section, settings });
  return (
    <>
      <DataForm section={section} onChange={onChange} />
      <SectionStyleForm settings={section.settings} siteFont={siteFont} onChange={changeSettings} />
      <SectionResponsiveForm
        settings={section.settings}
        onChange={changeSettings}
      />
    </>
  );
}
