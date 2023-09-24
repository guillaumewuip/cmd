import ContentLoader from "react-content-loader";

export function Skeleton() {
  return (
    <ContentLoader
      speed={4}
      width="100%"
      height="10rem"
      viewBox="0 0 742 172"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      preserveAspectRatio="xMinYMin meet"
    >
      <path d="M 0 0 h 172 v 172 H 0 z M 220 56 h 543 v 60 H 220 z" />
    </ContentLoader>
  );
}
