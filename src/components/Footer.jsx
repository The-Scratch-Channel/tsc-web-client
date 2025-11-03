import React from "react";
import {Link} from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t, i18n } = useTranslation();
  return (
    <footer>
      <div className="footer-main">
        <strong>The Scratch Channel</strong> {t("footer.disclaimer")}
      </div>
      <div className="footer-links">
        <div className="footer-group">
          <h4>{t("footer.headingabout")}</h4>
          <a href="/about">{t("footer.aboutlink")}</a><br/>
          <a href="/LICENSE">{t("footer.licenselink")}</a><br/>
          <a href="https://stats.uptimerobot.com/abiwl4EvLm">{t("footer.statuslink")}</a>
        </div>
        <div className="footer-group">
          <h4>{t("footer.headinglinks")}</h4>
          <Link to="/#articles">{t("footer.articleslink")}</Link><br />
          <a href="https://github.com/The-Scratch-Channel/the-scratch-channel.github.io/issues/new/choose">{t("footer.issuelink")}</a><br />
          <a href="https://g.page/r/CakZ0j7aw6SLEBM/review">{t("footer.reviewlink")}</a>
        </div>
        <div className="footer-group">
          <h4>{t("footer.headingcommunity")}</h4>
          <a href="https://scratch.mit.edu/discuss/topic/814999/">{t("footer.forumlink")}</a><br />
          <a href="https://github.com/The-Scratch-Channel/the-scratch-channel.github.io/">{t("footer.githublink")}</a>
        </div>
      </div>
      <br />
      <h4 className="footer-copyright-info">
        © {new Date().getFullYear()} The Scratch Channel
      </h4>
    </footer>
  );
}
