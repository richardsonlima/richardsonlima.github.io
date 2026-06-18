/* @ds-bundle: {"format":3,"namespace":"OnDesignSystem_79a6af","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"70d3986be42e","components/core/Button.jsx":"43d46a542e36","components/core/Card.jsx":"46203712674b"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.OnDesignSystem_79a6af = window.OnDesignSystem_79a6af || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Æon Badge — compact pill label for layers, protocols & status.
 * tones: layer (violet), signal (cyan), aurora (spectrum), violation, safe, warn, neutral.
 */
const Badge = ({
  children,
  tone = 'layer',
  mono = false,
  ...rest
}) => {
  const tones = {
    layer: {
      background: 'var(--aeon-tint-violet)',
      color: 'var(--aeon-violet-ink)'
    },
    signal: {
      background: 'var(--aeon-tint-cyan)',
      color: 'var(--aeon-cyan)'
    },
    aurora: {
      background: 'var(--aurora)',
      color: '#fff'
    },
    violation: {
      background: 'rgba(229,35,75,0.10)',
      color: 'var(--danger)'
    },
    safe: {
      background: 'rgba(22,163,74,0.12)',
      color: 'var(--success)'
    },
    warn: {
      background: 'rgba(217,119,6,0.12)',
      color: 'var(--warning)'
    },
    neutral: {
      background: 'var(--surface-muted)',
      color: 'var(--text-secondary)'
    }
  };
  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '5px 12px',
    borderRadius: 'var(--radius-pill)',
    fontFamily: mono ? 'var(--font-mono)' : 'var(--font-ui)',
    fontSize: '0.74rem',
    fontWeight: 600,
    letterSpacing: mono ? 0 : '0.2px',
    lineHeight: 1.35,
    ...tones[tone]
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `aeon-badge aeon-badge--${tone}`,
    style: style
  }, rest), children);
};
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Æon Button — pill-shaped action primitive (weightless, Antigravity-inspired).
 * Variants: primary (solid ink), secondary (soft gray), aurora (spectrum),
 * ghost (text), danger (violation), success (trust green).
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  as = 'button',
  full = false,
  disabled = false,
  icon = null,
  ...rest
}) => {
  const pad = size === 'sm' ? '9px 18px' : size === 'lg' ? '17px 34px' : '13px 26px';
  const fontSize = size === 'sm' ? '0.85rem' : size === 'lg' ? '1.05rem' : '0.95rem';
  const variants = {
    primary: {
      background: 'var(--aeon-ink)',
      color: '#fff',
      border: '1px solid var(--aeon-ink)'
    },
    secondary: {
      background: 'var(--surface-muted)',
      color: 'var(--text-primary)',
      border: '1px solid transparent'
    },
    aurora: {
      background: 'var(--aurora)',
      color: '#fff',
      border: 'none',
      boxShadow: 'var(--glow-violet)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-strong)'
    },
    danger: {
      background: 'var(--danger)',
      color: '#fff',
      border: '1px solid var(--danger)'
    },
    success: {
      background: 'var(--success)',
      color: '#fff',
      border: '1px solid var(--success)'
    }
  };
  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '9px',
    width: full ? '100%' : 'auto',
    padding: pad,
    fontSize,
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    lineHeight: 1,
    borderRadius: 'var(--radius-pill)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition: 'transform var(--dur-base) var(--ease-float), box-shadow var(--dur-base) var(--ease-standard), background var(--dur-base) var(--ease-standard)',
    ...variants[variant]
  };
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: `aeon-btn aeon-btn--${variant}`,
    style: style,
    disabled: as === 'button' ? disabled : undefined,
    onMouseEnter: e => {
      if (!disabled) e.currentTarget.style.transform = 'translateY(-2px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'translateY(0)';
    }
  }, rest), icon, children);
};
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Æon Card — soft light surface with a weightless hover lift. Set `aura`
 * for the signature spectrum glow bleeding around the card (hero/product cards).
 * variant: default | aura | industrial (violation outline) | console (dark).
 */
const Card = ({
  children,
  eyebrow,
  title,
  variant = 'default',
  hover = true,
  ...rest
}) => {
  const [lift, setLift] = React.useState(false);
  const isConsole = variant === 'console';
  const surface = {
    position: 'relative',
    background: isConsole ? 'var(--con-surface)' : 'var(--surface)',
    border: variant === 'industrial' ? '1.5px solid var(--danger)' : `1px solid ${isConsole ? 'var(--con-border)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-2xl)',
    padding: 'var(--space-8)',
    color: isConsole ? 'var(--con-ink)' : 'var(--text-primary)',
    transform: lift ? 'var(--lift)' : 'translateY(0)',
    boxShadow: lift ? 'var(--shadow-float)' : 'var(--shadow-card)',
    transition: 'transform var(--dur-base) var(--ease-float), box-shadow var(--dur-base) var(--ease-standard)',
    zIndex: 1
  };
  const wrap = {
    position: 'relative',
    borderRadius: 'var(--radius-2xl)'
  };
  const auraStyle = {
    position: 'absolute',
    inset: '-14px',
    borderRadius: 'inherit',
    background: 'var(--aurora-soft)',
    filter: 'blur(22px)',
    opacity: lift ? 0.95 : 0.7,
    transition: 'opacity var(--dur-slow) var(--ease-standard)',
    zIndex: 0,
    pointerEvents: 'none'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: `aeon-card-wrap`,
    style: wrap,
    onMouseEnter: () => hover && setLift(true),
    onMouseLeave: () => setLift(false)
  }, variant === 'aura' && /*#__PURE__*/React.createElement("div", {
    className: "aeon-card-aura",
    style: auraStyle
  }), /*#__PURE__*/React.createElement("div", _extends({
    className: `aeon-card aeon-card--${variant} ${isConsole ? 'aeon-console' : ''}`,
    style: surface
  }, rest), eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: '0.72rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: variant === 'industrial' ? 'var(--danger)' : 'var(--accent-ink)',
      marginBottom: '10px'
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: '1.4rem',
      fontWeight: 700,
      marginBottom: '12px',
      letterSpacing: '-0.02em'
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      color: isConsole ? 'var(--con-ink-dim)' : 'var(--text-secondary)',
      fontSize: '0.97rem'
    }
  }, children)));
};
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

})();
