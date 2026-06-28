export default function Cursor({ x, y, name, color }) {
    return (
        <div
            style={{
                position: "fixed",
                left: x,
                top: y,
                pointerEvents: "none",
                zIndex: 9999,
            }}
        >
            <div
                style={{
                    width: 12,
                    height: 12,
                    background: color,
                    borderRadius: "50%",
                }}
            />

            <div
                style={{
                    background: color,
                    color: "#fff",
                    fontSize: 12,
                    padding: "2px 6px",
                    borderRadius: 6,
                    marginTop: 4,
                    display: "inline-block",
                }}
            >
                {name}
            </div>
        </div>
    );
}