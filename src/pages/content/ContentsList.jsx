import { Link } from 'react-router-dom';
import './ContentsHome.css';

function ContentsList() {
  return (
    <main className="contents-list">
      <div className="container">
        <ul className="list">
          <li className="item">
            <Link>
              <div className="image">
                <img src="https://picsum.photos/id/11/400/600" alt="" />
              </div>
              <div className="title">name or title</div>
            </Link>
          </li>
          <li className="item">
            <Link>
              <div className="image">
                <img src="https://picsum.photos/id/11/400/600" alt="" />
              </div>
              <div className="title">name or title</div>
            </Link>
          </li>{' '}
          <li className="item">
            <Link>
              <div className="image">
                <img src="https://picsum.photos/id/11/400/600" alt="" />
              </div>
              <div className="title">name or title</div>
            </Link>
          </li>{' '}
          <li className="item">
            <Link>
              <div className="image">
                <img src="https://picsum.photos/id/11/400/600" alt="" />
              </div>
              <div className="title">name or title</div>
            </Link>
          </li>{' '}
          <li className="item">
            <Link>
              <div className="image">
                <img src="https://picsum.photos/id/11/400/600" alt="" />
              </div>
              <div className="title">name or title</div>
            </Link>
          </li>{' '}
          <li className="item">
            <Link>
              <div className="image">
                <img src="https://picsum.photos/id/11/400/600" alt="" />
              </div>
              <div className="title">name or title</div>
            </Link>
          </li>{' '}
          <li className="item">
            <Link>
              <div className="image">
                <img src="https://picsum.photos/id/11/400/600" alt="" />
              </div>
              <div className="title">name or title</div>
            </Link>
          </li>{' '}
          <li className="item">
            <Link>
              <div className="image">
                <img src="https://picsum.photos/id/11/400/600" alt="" />
              </div>
              <div className="title">name or title</div>
            </Link>
          </li>{' '}
          <li className="item">
            <Link>
              <div className="image">
                <img src="https://picsum.photos/id/11/400/600" alt="" />
              </div>
              <div className="title">name or title</div>
            </Link>
          </li>{' '}
          <li className="item">
            <Link>
              <div className="image">
                <img src="https://picsum.photos/id/11/400/600" alt="" />
              </div>
              <div className="title">name or title</div>
            </Link>
          </li>
        </ul>
      </div>
    </main>
  );
}

export default ContentsList;
