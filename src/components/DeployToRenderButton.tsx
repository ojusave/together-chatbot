import { DEPLOY_TO_RENDER_URL } from "@/lib/render";

export default function DeployToRenderButton() {
  return (
    <a
      href={DEPLOY_TO_RENDER_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="https://render.com/images/deploy-to-render-button.svg"
        alt="Deploy to Render"
        height={28}
      />
    </a>
  );
}
