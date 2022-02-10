type LoadingProps = {
  color?: string;
};

const Loading = ({ color }: LoadingProps) => {
  return (
    <div
      className="spinner-border"
      role="status"
      style={{ color: color ? color : "black" }}
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export default Loading;
