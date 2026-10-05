import { useState, type CSSProperties, type ReactNode } from "react";
import { BottomShapeDivider, PlayIcon, SectionShell, SiteButton, SiteImage, SiteLink, StarFilledIcon } from "../primitives.tsx";
import type { HeroData, SectionOf } from "../types.ts";

function getEmbedUrl(url?: string, isBackground = false): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  try {
    if (trimmed.includes("youtube.com") || trimmed.includes("youtu.be")) {
      let videoId = "";
      if (trimmed.includes("youtu.be/")) {
        videoId = trimmed.split("youtu.be/")[1]?.split("?")[0] ?? "";
      } else if (trimmed.includes("watch?v=")) {
        videoId = new URL(trimmed).searchParams.get("v") ?? "";
      } else if (trimmed.includes("/embed/")) {
        const afterEmbed = trimmed.split("/embed/")[1] ?? "";
        videoId = afterEmbed.split("?")[0] ?? "";
      }
      if (videoId) {
        if (isBackground) {
          return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&disablekb=1`;
        }
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
      }
    }
    if (trimmed.includes("vimeo.com")) {
      const match = trimmed.match(/vimeo\.com\/(\d+)/);
      if (match && match[1]) {
        if (isBackground) {
          return `https://player.vimeo.com/video/${match[1]}?autoplay=1&muted=1&loop=1&autopause=0&controls=0&background=1`;
        }
        return `https://player.vimeo.com/video/${match[1]}?autoplay=1`;
      }
    }
  } catch {
    return null;
  }
  return null;
}

function HeroVideoPlayer({
  videoUrl,
  posterUrl,
  autoplay = false,
  controls = true,
  loop = false,
  onPlayClick,
}: {
  videoUrl: string;
  posterUrl?: string;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  onPlayClick?: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const embedUrl = getEmbedUrl(videoUrl);

  if (embedUrl) {
    if (!isPlaying && posterUrl) {
      return (
        <div className="wb-hero-video-poster-wrap" onClick={() => setIsPlaying(true)}>
          <img src={posterUrl} alt="Video thumbnail" className="wb-hero-video-poster" />
          <button
            type="button"
            className="wb-hero-video-play-btn"
            aria-label="Play video demo"
            onClick={() => {
              setIsPlaying(true);
              onPlayClick?.();
            }}
          >
            <PlayIcon />
          </button>
        </div>
      );
    }
    return (
      <div className="wb-hero-video-iframe-wrap">
        <iframe
          src={embedUrl}
          title="Hero Video Demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="wb-hero-video-iframe"
        />
      </div>
    );
  }

  return (
    <div className="wb-hero-video-wrap">
      <video
        src={videoUrl}
        poster={posterUrl}
        controls={controls}
        autoPlay={autoplay}
        muted={autoplay}
        loop={loop}
        playsInline
        className="wb-hero-video-element"
      />
    </div>
  );
}

function renderHighlightedHeading(heading: string, highlight?: string): ReactNode {
  if (!highlight || !heading.includes(highlight)) {
    return <h1>{heading}</h1>;
  }
  const parts = heading.split(highlight);
  return (
    <h1>
      {parts[0]}
      <span className="wb-text-gradient">{highlight}</span>
      {parts.slice(1).join(highlight)}
    </h1>
  );
}

function SocialRating({ rating }: { rating?: HeroData["rating"] }) {
  if (!rating || (!rating.text && !rating.stars)) return null;
  const count = rating.avatarCount ?? 4;
  const stars = Math.min(Math.max(rating.stars ?? 5, 1), 5);

  return (
    <div className="wb-hero-rating">
      <div className="wb-avatar-stack">
        {Array.from({ length: count }).map((_, i) => (
          <span key={i} className="wb-avatar-circle" title="User">
            {String.fromCharCode(65 + i)}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="wb-stars-row">
          {Array.from({ length: stars }).map((_, i) => (
            <StarFilledIcon key={i} />
          ))}
        </div>
        {rating.text && <span className="wb-muted text-xs">{rating.text}</span>}
      </div>
    </div>
  );
}

function HeroCommunityIllustration() {
  return (
    <div className="wb-community-illustration-wrap" aria-label="Community team illustration">
      <svg
        viewBox="0 0 1000 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="wb-community-svg"
      >
        <defs>
          <linearGradient id="skinGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffd8b3" />
            <stop offset="100%" stopColor="#f5b98a" />
          </linearGradient>
          <linearGradient id="skinGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d28e5d" />
            <stop offset="100%" stopColor="#b36e3c" />
          </linearGradient>
          <linearGradient id="skinGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffe4c4" />
            <stop offset="100%" stopColor="#f7cd9f" />
          </linearGradient>
          <linearGradient id="shirtTeal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
          <linearGradient id="shirtYellow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="shirtCoral" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <linearGradient id="shirtOrange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <linearGradient id="shirtPurple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7e22ce" />
          </linearGradient>
          <linearGradient id="hairDark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#292524" />
            <stop offset="100%" stopColor="#1c1917" />
          </linearGradient>
          <linearGradient id="hairBrown" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Character 1 (Left Far - Guy with cap & thumbs up) */}
        <g transform="translate(40, 90)" filter="url(#softShadow)">
          {/* Body */}
          <path d="M10 190 Q70 140 130 190 L140 280 L0 280 Z" fill="url(#shirtTeal)" />
          {/* Head & Neck */}
          <rect x="55" y="125" width="30" height="40" rx="12" fill="url(#skinGrad1)" />
          <circle cx="70" cy="95" r="46" fill="url(#skinGrad1)" />
          {/* Orange Cap */}
          <path d="M26 80 Q70 45 114 80 Q120 70 85 60 Q50 55 26 80 Z" fill="#f97316" />
          <ellipse cx="60" cy="74" rx="42" ry="12" fill="#ea580c" />
          {/* Face: Eyes, glasses, smile */}
          <circle cx="54" cy="92" r="14" stroke="#1e293b" strokeWidth="4" fill="none" />
          <circle cx="86" cy="92" r="14" stroke="#1e293b" strokeWidth="4" fill="none" />
          <line x1="68" y1="92" x2="72" y2="92" stroke="#1e293b" strokeWidth="4" />
          <circle cx="54" cy="92" r="5" fill="#1e293b" />
          <circle cx="86" cy="92" r="5" fill="#1e293b" />
          <path d="M56 116 Q70 130 84 116" stroke="#b91c1c" strokeWidth="4" strokeLinecap="round" fill="#ffffff" />
          {/* Hand pointing */}
          <path d="M110 150 Q135 110 140 70 Q145 60 155 70 Q150 110 125 170" fill="url(#skinGrad1)" />
        </g>

        {/* Character 2 (Mid Left - Cheerful Guy with glasses) */}
        <g transform="translate(180, 50)" filter="url(#softShadow)">
          {/* Body */}
          <path d="M20 220 Q95 160 170 220 L180 320 L10 320 Z" fill="url(#shirtTeal)" />
          {/* Head */}
          <rect x="80" y="145" width="30" height="45" rx="12" fill="url(#skinGrad1)" />
          <circle cx="95" cy="105" r="54" fill="url(#skinGrad1)" />
          {/* Hair */}
          <path d="M42 95 Q95 35 148 95 Q152 70 120 45 Q70 40 42 95 Z" fill="url(#hairDark)" />
          {/* Black Glasses & Big Smile */}
          <rect x="58" y="90" width="30" height="26" rx="8" stroke="#0f172a" strokeWidth="4.5" fill="none" />
          <rect x="102" y="90" width="30" height="26" rx="8" stroke="#0f172a" strokeWidth="4.5" fill="none" />
          <line x1="88" y1="102" x2="102" y2="102" stroke="#0f172a" strokeWidth="4.5" />
          <circle cx="73" cy="103" r="5.5" fill="#0f172a" />
          <circle cx="117" cy="103" r="5.5" fill="#0f172a" />
          <path d="M72 130 Q95 152 118 130 Z" fill="#ffffff" stroke="#991b1b" strokeWidth="3" />
        </g>

        {/* Character 3 (Center Front - Smiling Girl with Pink Glasses & Beanie) */}
        <g transform="translate(370, 70)" filter="url(#softShadow)">
          {/* Body */}
          <path d="M30 200 Q130 140 230 200 L240 310 L20 310 Z" fill="#065f46" />
          {/* Head */}
          <rect x="115" y="135" width="30" height="40" rx="12" fill="url(#skinGrad3)" />
          <circle cx="130" cy="95" r="56" fill="url(#skinGrad3)" />
          {/* Long Brown Hair */}
          <path d="M70 95 Q60 190 75 240 Q130 60 185 240 Q200 190 190 95 Q130 30 70 95 Z" fill="url(#hairBrown)" />
          {/* Pink Glasses */}
          <rect x="88" y="78" width="36" height="30" rx="10" stroke="#ec4899" strokeWidth="5" fill="none" />
          <rect x="136" y="78" width="36" height="30" rx="10" stroke="#ec4899" strokeWidth="5" fill="none" />
          <line x1="124" y1="92" x2="136" y2="92" stroke="#ec4899" strokeWidth="5" />
          <circle cx="106" cy="93" r="6" fill="#1e293b" />
          <circle cx="154" cy="93" r="6" fill="#1e293b" />
          {/* Rosy Cheeks & Laughing Open Smile */}
          <circle cx="82" cy="115" r="10" fill="#f43f5e" opacity="0.4" />
          <circle cx="178" cy="115" r="10" fill="#f43f5e" opacity="0.4" />
          <path d="M102 122 Q130 156 158 122 Z" fill="#ffffff" stroke="#be123c" strokeWidth="3.5" />
          {/* Hands holding selfie */}
          <path d="M60 180 Q40 140 45 100 Q50 90 60 100 Q65 140 85 190" fill="url(#skinGrad3)" />
        </g>

        {/* Character 4 (Mid Right - Cheerful Guy with Yellow Shirt) */}
        <g transform="translate(560, 45)" filter="url(#softShadow)">
          {/* Body */}
          <path d="M20 225 Q100 165 180 225 L190 325 L10 325 Z" fill="url(#shirtYellow)" />
          {/* Head */}
          <rect x="85" y="150" width="30" height="45" rx="12" fill="url(#skinGrad2)" />
          <circle cx="100" cy="110" r="54" fill="url(#skinGrad2)" />
          {/* Curly Hair */}
          <circle cx="60" cy="75" r="22" fill="url(#hairDark)" />
          <circle cx="85" cy="60" r="24" fill="url(#hairDark)" />
          <circle cx="115" cy="60" r="24" fill="url(#hairDark)" />
          <circle cx="140" cy="75" r="22" fill="url(#hairDark)" />
          {/* Tortoise Glasses & Big Teeth Smile */}
          <rect x="65" y="94" width="30" height="26" rx="8" stroke="#78350f" strokeWidth="4.5" fill="none" />
          <rect x="105" y="94" width="30" height="26" rx="8" stroke="#78350f" strokeWidth="4.5" fill="none" />
          <line x1="95" y1="106" x2="105" y2="106" stroke="#78350f" strokeWidth="4.5" />
          <circle cx="80" cy="107" r="5.5" fill="#0f172a" />
          <circle cx="120" cy="107" r="5.5" fill="#0f172a" />
          <path d="M78 135 Q100 160 122 135 Z" fill="#ffffff" stroke="#78350f" strokeWidth="3" />
        </g>

        {/* Character 5 (Far Right - Excited Guy taking selfie & pointing) */}
        <g transform="translate(720, 30)" filter="url(#softShadow)">
          {/* Body */}
          <path d="M30 240 Q110 180 190 240 L200 340 L20 340 Z" fill="url(#shirtCoral)" />
          {/* Head */}
          <rect x="95" y="165" width="30" height="45" rx="12" fill="url(#skinGrad1)" />
          <circle cx="110" cy="120" r="56" fill="url(#skinGrad1)" />
          {/* Spiky / Curly Hair */}
          <path d="M55 100 Q110 30 165 100 Q175 75 140 45 Q90 35 55 100 Z" fill="url(#hairBrown)" />
          {/* Big Excited Eyes & Huge Laugh */}
          <circle cx="88" cy="115" r="6.5" fill="#0f172a" />
          <circle cx="132" cy="115" r="6.5" fill="#0f172a" />
          <path d="M82 142 Q110 180 138 142 Z" fill="#ffffff" stroke="#991b1b" strokeWidth="3.5" />
          {/* Pointing Arm / Hand */}
          <path d="M150 210 Q190 160 210 100 Q218 85 230 100 Q215 150 180 230" fill="url(#skinGrad1)" />
        </g>
      </svg>
    </div>
  );
}

function HeroMockupPlaceholder() {
  return (
    <div className="wb-hero-mockup-placeholder">
      <div className="wb-placeholder-glow" />
      <div className="wb-placeholder-card-header">
        <div className="wb-placeholder-avatar" />
        <div className="wb-placeholder-bars">
          <div className="wb-placeholder-bar-title" />
          <div className="wb-placeholder-bar-sub" />
        </div>
      </div>
      <div className="wb-placeholder-chart">
        <div className="wb-chart-bar" style={{ height: "35%" }} />
        <div className="wb-chart-bar" style={{ height: "60%" }} />
        <div className="wb-chart-bar" style={{ height: "45%" }} />
        <div className="wb-chart-bar" style={{ height: "80%" }} />
        <div className="wb-chart-bar" style={{ height: "100%" }} />
        <div className="wb-chart-bar" style={{ height: "70%" }} />
      </div>
    </div>
  );
}

function FloatingCards({ cards }: { cards?: HeroData["floatingCards"] }) {
  if (!cards || cards.length === 0) return null;
  return (
    <>
      {cards.slice(0, 2).map((card, idx) => (
        <div
          key={`${card.title}-${idx}`}
          className={`wb-hero-floating-card wb-hero-floating-card-${idx + 1}`}
        >
          {card.icon && <div className="wb-floating-icon">{card.icon}</div>}
          <div className="wb-floating-card-text">
            <strong>{card.title}</strong>
            {card.subtitle && <span>{card.subtitle}</span>}
          </div>
          {card.badge && <span className="wb-badge">{card.badge}</span>}
        </div>
      ))}
    </>
  );
}

function TrustedByStrip({ trustedBy }: { trustedBy?: HeroData["trustedBy"] }) {
  if (!trustedBy || (!trustedBy.logos?.length && !trustedBy.label)) return null;
  return (
    <div className="wb-hero-trusted-by">
      {trustedBy.label && <div className="wb-trusted-label">{trustedBy.label}</div>}
      {trustedBy.logos && trustedBy.logos.length > 0 && (
        <div className="wb-trusted-logos">
          {trustedBy.logos.map((logo, i) => (
            <span key={i} className="wb-trusted-logo-item">
              {logo.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HeroSection({ section }: { section: SectionOf<"hero"> }) {
  const { data } = section;

  const minHeightClass =
    data.minHeight === "screen"
      ? "wb-hero-min-screen"
      : data.minHeight === "tall"
        ? "wb-hero-min-tall"
        : data.minHeight === "compact"
          ? "wb-hero-min-compact"
          : "";

  const allButtons = data.buttons?.length
    ? data.buttons
    : [data.primaryCta, data.secondaryCta].filter(Boolean);

  const actions = (allButtons.length > 0 || data.tertiaryCta) && (
    <div className="wb-hero-actions">
      {allButtons.map((btn, idx) =>
        btn ? (
          <SiteButton
            key={`${btn.label}-${btn.href}-${idx}`}
            link={btn}
            tone={idx === 0 ? "primary" : "secondary"}
          />
        ) : null
      )}
      {data.tertiaryCta && (
        <SiteLink link={data.tertiaryCta} className="wb-btn-video-play">
          <span className="wb-play-icon-pill">
            <PlayIcon />
          </span>
          <span>{data.tertiaryCta.label}</span>
        </SiteLink>
      )}
    </div>
  );

  const copy = (
    <div className="wb-hero-copy">
      {(data.eyebrow || data.badgeIcon) && (
        <div className="wb-hero-badge">
          {data.badgeIcon && <span>{data.badgeIcon}</span>}
          {data.eyebrow && <span>{data.eyebrow}</span>}
        </div>
      )}

      {data.heading ? renderHighlightedHeading(data.heading, data.highlightText) : null}

      {data.subheading && <p className="wb-hero-sub wb-muted">{data.subheading}</p>}
      {data.description && <p className="wb-hero-desc wb-muted">{data.description}</p>}

      {actions}

      <SocialRating rating={data.rating} />
      <TrustedByStrip trustedBy={data.trustedBy} />
    </div>
  );

  const isBgMediaMode =
    data.imagePosition === "background" ||
    data.variant === "background-image" ||
    data.variant === "video-bg";

  const bgImage =
    data.backgroundImage ||
    (isBgMediaMode && data.image ? data.image : undefined);

  const bgVideoUrl =
    data.backgroundVideoUrl ||
    (isBgMediaMode && data.videoUrl
      ? data.videoUrl
      : data.variant === "video-bg"
        ? data.videoUrl
        : undefined);

  const isBottomIllustration =
    data.bgImagePosition === "bottom" && !bgImage?.url && !bgVideoUrl;

  const hasBgMedia = Boolean(bgImage?.url || bgVideoUrl || isBottomIllustration);

  const bgEmbedUrl = getEmbedUrl(bgVideoUrl, true);

  const hasForegroundVideo =
    Boolean(data.videoUrl) &&
    !isBgMediaMode &&
    (data.mediaType === "video" || data.mediaType === "both" || !data.image);

  const hasForegroundImage =
    Boolean(data.image) && !isBgMediaMode && data.mediaType !== "video";

  const hasAnyMedia =
    hasForegroundVideo ||
    hasForegroundImage ||
    Boolean(data.floatingCards?.length) ||
    data.variant === "floating-cards";

  const mediaContent = hasAnyMedia && (
    <div
      className={`wb-hero-media ${data.imageStyle === "mockup" ? "wb-hero-media-mockup" : ""} ${
        data.imageStyle === "glow" ? "wb-hero-media-glow" : ""
      }`}
    >
      {data.imageStyle === "mockup" && (
        <div className="wb-mockup-header">
          <span className="wb-mockup-dot wb-mockup-dot-red" />
          <span className="wb-mockup-dot wb-mockup-dot-yellow" />
          <span className="wb-mockup-dot wb-mockup-dot-green" />
        </div>
      )}
      <div className="wb-floating-card-wrap">
        {data.videoUrl ? (
          <HeroVideoPlayer
            videoUrl={data.videoUrl}
            posterUrl={data.image?.url}
            autoplay={data.videoAutoplay}
            controls={data.videoControls ?? true}
            loop={data.videoLoop}
          />
        ) : data.image ? (
          <SiteImage image={data.image} />
        ) : (
          <HeroMockupPlaceholder />
        )}
        <FloatingCards cards={data.floatingCards} />
      </div>
    </div>
  );

  const isSplit =
    data.variant === "split" ||
    data.variant === "split-left" ||
    data.variant === "asymmetric" ||
    data.variant === "floating-cards";

  const bgPosClass = data.bgImagePosition
    ? `wb-bg-pos-${data.bgImagePosition}`
    : "wb-bg-pos-cover";

  const overlayType = data.bgOverlayType ?? "dark";

  const overlayStyle: CSSProperties = {
    opacity: (data.overlayOpacity ?? 50) / 100,
    backdropFilter: data.overlayBlur ? "blur(8px)" : undefined,
    WebkitBackdropFilter: data.overlayBlur ? "blur(8px)" : undefined,
  };

  const isDarkOverlay =
    (hasBgMedia && (overlayType === "dark" || (overlayType as string) === "default")) ||
    data.variant === "background-image" ||
    data.variant === "video-bg" ||
    (isBgMediaMode && Boolean(bgVideoUrl || bgImage));

  const isSoftCard = data.variant === "soft-card";

  return (
    <SectionShell
      sectionId={section.id}
      settings={section.settings}
      className={`wb-hero wb-hero-${data.variant} ${minHeightClass} ${
        hasBgMedia ? "wb-hero-has-bg-media" : ""
      } ${isDarkOverlay ? "wb-hero-dark-overlay" : ""} ${
        isBottomIllustration ? "wb-hero-bottom-illustration" : ""
      }`}
      label="Hero"
    >
      {/* Full Background Image / Video / Illustration media layer */}
      {hasBgMedia && (
        <>
          <div className={`wb-hero-bg-media ${bgPosClass}`}>
            {bgEmbedUrl ? (
              <div className="wb-hero-bg-iframe-container">
                <iframe
                  src={bgEmbedUrl}
                  title="Hero Background Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  className="wb-hero-bg-iframe"
                />
              </div>
            ) : bgVideoUrl ? (
              <video autoPlay loop muted playsInline src={bgVideoUrl} />
            ) : bgImage?.url ? (
              <img
                src={bgImage.url}
                alt={bgImage.alt ?? "Hero background"}
                loading="eager"
              />
            ) : isBottomIllustration ? (
              <HeroCommunityIllustration />
            ) : null}
          </div>
          {overlayType !== "none" && !isBottomIllustration && (
            <div
              className={`wb-hero-overlay wb-overlay-${overlayType}`}
              style={overlayType !== "gradient" ? overlayStyle : undefined}
            />
          )}
        </>
      )}

      {/* Main Content Layout */}
      {isSoftCard ? (
        <div className="wb-hero-card-container">
          <div className="wb-hero-grid">
            {copy}
            {mediaContent}
          </div>
        </div>
      ) : isSplit ? (
        <div className="wb-hero-grid">
          {copy}
          {mediaContent}
        </div>
      ) : (
        <>
          {copy}
          {mediaContent}
        </>
      )}

      {/* Optional Wave/Curved SVG Shape Divider */}
      <BottomShapeDivider shape={data.bottomShape} />
    </SectionShell>
  );
}
