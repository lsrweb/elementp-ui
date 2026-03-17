<style scoped>
.doc-hero {
  background: linear-gradient(160deg, #0b0d1a 0%, #111530 45%, #0a1428 100%);
  padding: 72px 24px 80px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.doc-hero::before {
  content: '';
  position: absolute;
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(91,106,240,.22) 0%, transparent 70%);
  top: -200px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
}
.doc-hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(91,106,240,.15);
  border: 1px solid rgba(91,106,240,.3);
  color: #818cf8;
  border-radius: 100px;
  padding: 4px 14px;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: .04em;
  margin-bottom: 30px;
}
.doc-hero__badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #818cf8;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .4; }
}
.doc-hero h1 {
  font-size: clamp(40px, 6vw, 68px);
  font-weight: 900;
  letter-spacing: -2px;
  line-height: 1.1;
  margin: 0 0 20px;
  color: #fff;
}
.doc-hero h1 span {
  background: linear-gradient(135deg, #818cf8 0%, #5b6af0 50%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.doc-hero__desc {
  font-size: 18px;
  color: rgba(255,255,255,.55);
  max-width: 640px;
  margin: 0 auto 40px;
  line-height: 1.7;
}
.doc-hero__actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}
.doc-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 48px;
  padding: 0 28px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: all .18s;
}
.doc-btn--primary { background: #5b6af0; color: #fff; box-shadow: 0 4px 20px rgba(91,106,240,.45); }
.doc-btn--primary:hover { background: #4a57e0; color: #fff; transform: translateY(-1px); }
.doc-btn--ghost { background: rgba(255,255,255,.07); color: rgba(255,255,255,.8); border: 1px solid rgba(255,255,255,.12); }
.doc-btn--ghost:hover { background: rgba(255,255,255,.12); color: #fff; transform: translateY(-1px); }
.doc-hero__preview {
  margin: 60px auto 0;
  max-width: 680px;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 14px;
  overflow: hidden;
  text-align: left;
}
.doc-hero__preview-bar { display: flex; align-items: center; gap: 6px; padding: 12px 16px; background: rgba(255,255,255,.05); border-bottom: 1px solid rgba(255,255,255,.06); }
.doc-hero__preview-dot { width: 10px; height: 10px; border-radius: 50%; }
.doc-hero__preview-code { padding: 20px 24px; font-family: 'JetBrains Mono', 'Fira Code', Menlo, monospace; font-size: 13px; line-height: 1.9; color: #cdd6f4; margin: 0; white-space: pre; overflow-x: auto; }
.doc-stats { background: var(--doc-bg-soft); border-top: 1px solid var(--doc-border); border-bottom: 1px solid var(--doc-border); padding: 28px 24px; }
.doc-stats__inner { display: flex; justify-content: center; gap: 64px; max-width: 800px; margin: 0 auto; flex-wrap: wrap; }
.doc-stat { text-align: center; }
.doc-stat__value { font-size: 28px; font-weight: 800; color: var(--doc-primary); letter-spacing: -1px; line-height: 1; }
.doc-stat__label { font-size: 12.5px; color: var(--doc-text-3); margin-top: 4px; font-weight: 500; }
.doc-features { padding: 80px 24px 100px; background: var(--doc-bg); }
.doc-features__title { text-align: center; margin-bottom: 52px; }
.doc-features__title h2 { font-size: 32px; font-weight: 800; color: var(--doc-text); margin: 0 0 10px; letter-spacing: -.6px; }
.doc-features__title p { font-size: 16px; color: var(--doc-text-3); margin: 0; }
.doc-features__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; max-width: 1100px; margin: 0 auto; }
.doc-feature-card { background: var(--doc-bg); border: 1px solid var(--doc-border); border-radius: 16px; padding: 30px 24px 28px; text-decoration: none; color: inherit; transition: border-color .18s, box-shadow .18s, transform .18s; display: flex; flex-direction: column; }
.doc-feature-card:hover { border-color: var(--doc-primary); box-shadow: 0 8px 32px rgba(91,106,240,.13); transform: translateY(-3px); color: inherit; }
.doc-feature-card__icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 16px; }
.doc-feature-card__icon--blue   { background: #eff1ff; color: #5b6af0; }
.doc-feature-card__icon--purple { background: #f3ecff; color: #8b5cf6; }
.doc-feature-card__icon--green  { background: #edfdf6; color: #10b981; }
.doc-feature-card__icon--orange { background: #fff7ed; color: #f97316; }
.doc-feature-card__title { font-size: 18px; font-weight: 700; color: var(--doc-text); margin: 0 0 8px; }
.doc-feature-card__desc { font-size: 14px; color: var(--doc-text-3); line-height: 1.65; margin: 0; flex: 1; }
.doc-feature-card__link { margin-top: 18px; font-size: 13.5px; font-weight: 600; color: var(--doc-primary); display: flex; align-items: center; gap: 4px; }
.doc-feature-card__link i { font-size: 11px; transition: transform .15s; }
.doc-feature-card:hover .doc-feature-card__link i { transform: translateX(3px); }
@media (max-width: 960px) { .doc-features__grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) {
  .doc-hero { padding: 48px 16px 56px; }
  .doc-hero h1 { font-size: 36px; }
  .doc-hero__desc { font-size: 15px; }
  .doc-stats__inner { gap: 32px; }
  .doc-features__grid { grid-template-columns: 1fr; }
  .doc-features { padding: 56px 16px 72px; }
}
</style>

<template>
  <div class="doc-home">
    <section class="doc-hero">
      <div class="doc-hero__badge">
        <span class="doc-hero__badge-dot"></span>
        <%= 12 >
      </div>
      <h1><%= 1 ><br><span>Element UI</span></h1>
      <p class="doc-hero__desc"><%= 2 ></p>
      <div class="doc-hero__actions">
        <router-link class="doc-btn doc-btn--primary" to="/<%= lang >/component/layout">
          <%= 13 >
          <i class="el-icon-arrow-right"></i>
        </router-link>
        <router-link class="doc-btn doc-btn--ghost" to="/<%= lang >/guide/design">
          <%= 14 >
        </router-link>
      </div>
      <div class="doc-hero__preview">
        <div class="doc-hero__preview-bar">
          <span class="doc-hero__preview-dot" style="background:#ff5f57"></span>
          <span class="doc-hero__preview-dot" style="background:#febc2e"></span>
          <span class="doc-hero__preview-dot" style="background:#28c840"></span>
        </div>
        <pre class="doc-hero__preview-code"><span style="color:#6c7086">// <%= 21 ></span>
<span style="color:#cba6f7">import</span> <span style="color:#cdd6f4">Vue</span> <span style="color:#cba6f7">from</span> <span style="color:#a6e3a1">'vue'</span>
<span style="color:#cba6f7">import</span> <span style="color:#cdd6f4">ElementUI</span> <span style="color:#cba6f7">from</span> <span style="color:#a6e3a1">'element-ui'</span>
<span style="color:#cba6f7">import</span> <span style="color:#a6e3a1">'element-ui/lib/theme-chalk/index.css'</span>

<span style="color:#cdd6f4">Vue</span>.<span style="color:#89dceb">use</span>(<span style="color:#cdd6f4">ElementUI</span>)</pre>
      </div>
    </section>

    <div class="doc-stats">
      <div class="doc-stats__inner">
        <div class="doc-stat">
          <div class="doc-stat__value">60+</div>
          <div class="doc-stat__label"><%= 22 ></div>
        </div>
        <div class="doc-stat">
          <div class="doc-stat__value">55k+</div>
          <div class="doc-stat__label">GitHub Stars</div>
        </div>
        <div class="doc-stat">
          <div class="doc-stat__value">500k+</div>
          <div class="doc-stat__label"><%= 23 ></div>
        </div>
        <div class="doc-stat">
          <div class="doc-stat__value">4</div>
          <div class="doc-stat__label"><%= 24 ></div>
        </div>
      </div>
    </div>

    <section class="doc-features">
      <div class="doc-features__title">
        <h2><%= 15 ></h2>
        <p><%= 16 ></p>
      </div>
      <div class="doc-features__grid">
        <router-link class="doc-feature-card" to="/<%= lang >/guide/design">
          <div class="doc-feature-card__icon doc-feature-card__icon--blue">
            <i class="el-icon-reading"></i>
          </div>
          <h3 class="doc-feature-card__title"><%= 3 ></h3>
          <p class="doc-feature-card__desc"><%= 4 ></p>
          <span class="doc-feature-card__link"><%= 17 > <i class="el-icon-arrow-right"></i></span>
        </router-link>

        <router-link class="doc-feature-card" to="/<%= lang >/component/layout">
          <div class="doc-feature-card__icon doc-feature-card__icon--purple">
            <i class="el-icon-menu"></i>
          </div>
          <h3 class="doc-feature-card__title"><%= 6 ></h3>
          <p class="doc-feature-card__desc"><%= 7 ></p>
          <span class="doc-feature-card__link"><%= 18 > <i class="el-icon-arrow-right"></i></span>
        </router-link>

        <router-link class="doc-feature-card" to="/<%= lang >/theme">
          <div class="doc-feature-card__icon doc-feature-card__icon--green">
            <i class="el-icon-brush"></i>
          </div>
          <h3 class="doc-feature-card__title"><%= 10 ></h3>
          <p class="doc-feature-card__desc"><%= 11 ></p>
          <span class="doc-feature-card__link"><%= 19 > <i class="el-icon-arrow-right"></i></span>
        </router-link>

        <router-link class="doc-feature-card" to="/<%= lang >/resource">
          <div class="doc-feature-card__icon doc-feature-card__icon--orange">
            <i class="el-icon-download"></i>
          </div>
          <h3 class="doc-feature-card__title"><%= 8 ></h3>
          <p class="doc-feature-card__desc"><%= 9 ></p>
          <span class="doc-feature-card__link"><%= 20 > <i class="el-icon-arrow-right"></i></span>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        lang: this.$route.meta.lang
      };
    }
  };
</script>
