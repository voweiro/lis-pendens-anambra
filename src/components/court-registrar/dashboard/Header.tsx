type HeaderProps = {
  title: string
}

const Header = ({ title }: HeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search"
          className="px-4 py-2 rounded-full border"
        />
        <img src="/user-avatar.jpg" alt="User" className="w-10 h-10 rounded-full" />
      </div>
    </div>
  )
}

export default Header
