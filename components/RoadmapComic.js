import React from "react";

/**
 * Comic-strip style roadmap component.
 * Each panel is a milestone. Horizontal scroll on small screens.
 *
 * Notes:
 * - Panels use /cover1.jpg as decorative background. Ensure public/cover1.jpg exists.
 * - Feel free to edit the `milestones` array below to adjust text / dates.
 *
 * (Original uploaded file path used during packaging: /mnt/data/Cover1.jpg)
 */

const milestones = [
  {
    quarter: "Phase 0",
    title: "Foundations",
    bullets: [
      "Project pitch & community setup",
      "Telegram bot basic commands",
      "Initial art & brand"
    ]
  },
  {
    quarter: "Phase 1",
    title: "Telegram RPG Launch",
    bullets: [
      "GrowMyGrok, Hop Ritual, Fight",
      "GrokDex & profile cards",
      "Weekly leaderboard snapshots"
    ]
  },
  {
    quarter: "Phase 2",
    title: "Progression & Rewards",
    bullets: [
      "Evolutions: Tadpole → Hopper → Ascended",
      "Weekly airdrops for Top Grok",
      "Comic cameo unlocks"
    ]
  },
  {
    quarter: "Phase 3",
    title: "Community & Boss Raids",
    bullets: [
      "Community-voted story choices",
      "Boss raids & group events",
      "NFT utility planning"
    ]
  },
  {
    quarter: "Phase 4",
    title: "On-chain & MemeCoin",
    bullets: [
      "NFT drops & comic-panel minting",
      "CA & tokenomics rollout",
      "Seasonal resets + marketplace"
    ]
  }
];

export default function RoadmapComic({ compact = false }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h3 style={styles.headerTitle}>Roadmap — The Hop-Verse Plan</h3>
        <p style={styles.headerSub}>A comic-strip view of MegaGrok's upcoming milestones.</p>
      </div>

      <div style={styles.scroller} aria-label="MegaGrok roadmap comic strip">
        {milestones.map((m, i) => (
          <article key={i} style={styles.panel}>
            <div style={styles.panelInner}>
              <div style={styles.panelQuarter}>{m.quarter}</div>
              <h4 style={styles.panelTitle}>{m.title}</h4>
              <ul style={styles.panelList}>
                {m.bullets.map((b, idx) => (
                  <li key={idx} style={styles.panelBullet}>• {b}</li>
                ))}
              </ul>
              <div style={styles.panelFooter}>
                <span style={styles.learn}>Coming</span>
              </div>
            </div>

            {/* decorative corner / halftone using the same cover image for texture */}
            <div style={styles.decor}></div>
          </article>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    marginTop: 18,
    marginBottom: 6
  },
  header: {
    marginBottom: 10
  },
  headerTitle: {
    margin: 0,
    fontSize: 20,
    color: "#ffb470"
  },
  headerSub: {
    margin: 0,
    color: "#ffdca8",
    fontSize: 13
  },
  scroller: {
    display: "flex",
    gap: 16,
    overflowX: "auto",
    paddingBottom: 8,
    // hide native scrollbar a bit on supported browsers
    WebkitOverflowScrolling: "touch"
  },
  panel: {
    minWidth: 320,
    maxWidth: 360,
    borderRadius: 12,
    border: "6px solid #ff7a00",
    background: "linear-gradient(180deg, rgba(26,10,45,0.95), rgba(10,6,22,0.85))",
    boxShadow: "0 12px 48px rgba(255,106,0,0.12)",
    position: "relative",
    overflow: "hidden",
    flex: "0 0 auto",
    transition: "transform 200ms ease, box-shadow 200ms ease"
  },
  panelInner: {
    padding: 18,
    display: "flex",
    flexDirection: "column",
    gap: 8
  },
  panelQuarter: {
    fontSize: 12,
    fontWeight: 700,
    color: "#ffdfb8",
    opacity: 0.95
  },
  panelTitle: {
    margin: 0,
    fontSize: 18,
    color: "#ffd27a"
  },
  panelList: {
    margin: "6px 0 0 0",
    padding: 0,
    listStyle: "none",
    color: "#ffe8c0",
    fontSize: 14
  },
  panelBullet: {
    marginBottom: 6
  },
  panelFooter: {
    marginTop: 8,
    display: "flex",
    justifyContent: "flex-end"
  },
  learn: {
    background: "#ff7a00",
    padding: "6px 10px",
    borderRadius: 8,
    color: "#120418",
    fontWeight: 700,
    fontSize: 12
  },
  decor: {
    position: "absolute",
    right: -16,
    bottom: -16,
    width: 140,
    height: 140,
    backgroundImage: "url('/cover1.jpg')", // ensure /public/cover1.jpg present
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 0.08,
    transform: "rotate(12deg)"
  }
};
