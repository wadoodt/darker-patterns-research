import React from "react";

const GoToTopButton: React.FC = () => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return visible ? (
    <button
      className="go-to-top-btn"
      onClick={handleClick}
      aria-label="Go to top"
      tabIndex={0}
      style={{
        position: "fixed",
        right: 24,
        bottom: 32,
        zIndex: 1000,
        background: "var(--accent-9)",
        color: "var(--accent-1)",
        border: "none",
        borderRadius: 24,
        padding: "12px 18px",
        boxShadow: "0 2px 8px var(--gray-a5)",
        cursor: "pointer",
        fontSize: 18,
        transition: "background 0.2s",
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
    >
      ↑
    </button>
  ) : null;
};

export default GoToTopButton;
