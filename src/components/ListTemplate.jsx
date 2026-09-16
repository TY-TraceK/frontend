import { Link } from 'react-router-dom';
import { useState } from 'react';
import Select from './Select';

function ListTemplate() {
  const [selectedRegion, setSelectedRegion] = useState('부산광역시');

  const regions = ['부산광역시', '서울특별시', '경기도', '인천광역시'];

  return (
    <main className="list-template">
      <div className="container">
        <div className="filter">
          {' '}
          <Select
            value={selectedRegion}
            options={regions}
            onChange={setSelectedRegion}
          />
        </div>

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
          </li>
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
          </li>
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
          </li>
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
          </li>
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
          </li>
        </ul>
      </div>
    </main>
  );
}

export default ListTemplate;
