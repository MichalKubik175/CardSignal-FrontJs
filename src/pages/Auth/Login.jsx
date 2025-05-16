export default function Login() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Login Page</h1>
      <form>
        <input type="text" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}