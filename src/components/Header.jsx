import { Link } from "react-router-dom";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import "./Header.css";

function Header() {
  return (
    <header>
      <div className="container">
        <h1>
          {/* TODO: 로고 변경 */}
          <Link to="/">K</Link>
        </h1>
        <section className="search relative">
          <input
            className="global-search"
            type="text"
            placeholder="검색어를 입력하세요."
          />
          <span className="icon">
            <MagnifyingGlassIcon />
          </span>
        </section>
      </div>
    </header>
  );
}

export default Header;
