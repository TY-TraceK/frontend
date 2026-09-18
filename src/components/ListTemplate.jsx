import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import UserService from '@/api/services/userService.js';

const TYPE_ERROR_MESSAGE = {
  artist: '아티스트 목록을 확인할 수 없습니다.',
  media: '미디어 목록을 확인할 수 없습니다.',
  place: '여행지 목록을 확인할 수 없습니다.',
};

const getItemLink = (type, item) => {
  if (type === 'artist') {
    return `/content/detail?type=artist&id=${item.id}`;
  }

  if (type === 'media') {
    return `/content/detail?id=${item.id}`;
  }

  return `/place?id=${item.id}`;
};

const getItemImage = (type, item) =>
  type === 'place' ? item.mainImageUrl : item.pictureUrl;

function ListTemplate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // MEMO: type이 없거나 알 수 없으면 여행지로 취급합니다.
  const type = ['artist', 'media'].includes(searchParams.get('type'))
    ? searchParams.get('type')
    : 'place';

  const [items, setItems] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchItems = async () => {
      try {
        const data =
          type === 'place'
            ? await UserService.getMyLikedLocations()
            : await UserService.getMyFans();

        if (cancelled) return;

        if (type === 'place') {
          setItems(data ?? []);
        } else {
          setItems((type === 'artist' ? data.artist : data.content) ?? []);
        }
      } catch (e) {
        console.error(e);

        if (cancelled) return;

        window.alert(TYPE_ERROR_MESSAGE[type]);
        navigate(-1);
      }
    };

    fetchItems();

    return () => {
      cancelled = true;
    };
  }, [type, navigate]);

  return (
    <main className="list-template">
      <div className="container">
        <ul className="list">
          {items?.map((item) => (
            <li className="item" key={item.id}>
              <Link to={getItemLink(type, item)}>
                <div className="image">
                  {getItemImage(type, item) && (
                    <img src={getItemImage(type, item)} alt={item.name} />
                  )}
                </div>
                <div className="title">{item.name}</div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default ListTemplate;
