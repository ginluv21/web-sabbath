function Button({ children, onClick, className = '', ...props }) {
  return (
    <button type="button" className={`nes-btn ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  )
}

export default Button
