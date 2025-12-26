export default function Button({ className = "", variant = "primary", ...props }) {
    const cls =
        variant === "secondary"
        ? `btn-secondary ${className}`
        : `btn-primary ${className}`;

    return <button className={cls} {...props} />;
    }
