import { Link } from 'react-router-dom';
import { useState } from 'react';
import Select from './Select';

function ListTemplate({
  items = [],
  filters = [],
  emptyMessage = '목록이 없습니다.',
  getItemKey = (item) => item.id,
  getItemLink = () => '#',
  getImageUrl = (item) => item.imageUrl,
  getImageAlt = (item) => item.title ?? item.name ?? '',
  getItemTitle = (item) => item.title ?? item.name ?? '',
  filterItems = (itemsToFilter) => itemsToFilter,
}) {
  const initialFilters = Object.fromEntries(
    filters.map((filter) => [filter.name, filter.defaultValue ?? ''])
  );
  const [selectedFilters, setSelectedFilters] = useState(initialFilters);

  const handleFilterChange = (name, value) => {
    setSelectedFilters((previous) => ({ ...previous, [name]: value }));
  };

  if (type === 'media') {
    return `/content/detail?id=${item.id}`;
  }

  return `/place?id=${item.id}`;
};

const getItemImage = (type, item) =>
  type === 'place' ? item.mainImageUrl : item.pictureUrl;

function ListTemplate({
  filters = [],
  emptyMessage = '목록이 없습니다.',
  getItemKey,
  getItemLink: customGetItemLink,
  getImageUrl,
  getImageAlt = (item) => item.title ?? item.name ?? '',
  getItemTitle = (item) => item.title ?? item.name ?? '',
  filterItems = (itemsToFilter) => itemsToFilter,
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const type = ['artist', 'media'].includes(searchParams.get('type'))
    ? searchParams.get('type')
    : 'place';

  const [items, setItems] = useState([]);

  const initialFilters = Object.fromEntries(
    filters.map((filter) => [
      filter.name,
      filter.defaultValue ?? '',
    ])
  );

  const [selectedFilters, setSelectedFilters] = useState(initialFilters);

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
          setItems(
            (type === 'artist' ? data.artist : data.content) ?? []
          );
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

  const handleFilterChange = (name, value) => {
    setSelectedFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const filteredItems = filterItems(items, selectedFilters);

  const resolvedGetItemKey =
    getItemKey ?? ((item) => item.id);

  const resolvedGetItemLink =
    customGetItemLink ?? ((item) => getItemLink(type, item));

  const resolvedGetImageUrl =
    getImageUrl ?? ((item) => getItemImage(type, item));

  const resolvedGetImageAlt =
    getImageAlt ?? ((item) => item.name ?? '');

  return (
    <main className="list-template">
      <div className="container">
        {filters.length > 0 && (
          <div className="filter">
            {filters.map((filter) => (
              <Select
                key={filter.name}
                value={selectedFilters[filter.name]}
                options={filter.options}
                onChange={(value) => {
                  handleFilterChange(filter.name, value);
                  filter.onChange?.(value);
                }}
              />
            ))}
          </div>
        )}

        {filteredItems.length === 0 ? (
          <div>{emptyMessage}</div>
        ) : (
          <ul className="list">
            {filteredItems.map((item) => (
              <li
                className="item"
                key={resolvedGetItemKey(item)}
              >
                <Link to={resolvedGetItemLink(item)}>
                  <div className="image">
                    {resolvedGetImageUrl(item) && (
                      <img
                        src={resolvedGetImageUrl(item)}
                        alt={resolvedGetImageAlt(item)}
                      />
                    )}
                  </div>

                  <div className="title">
                    {getItemTitle(item)}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

export default ListTemplate;