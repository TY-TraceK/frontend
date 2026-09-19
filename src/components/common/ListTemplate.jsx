import { Link } from 'react-router-dom';
import { useState } from 'react';
import ImagePlaceholder from '../../components/common/ImagePlaceholder';
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

  const filteredItems = filterItems(items, selectedFilters);

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
              <li className="item" key={getItemKey(item)}>
                <Link to={getItemLink(item)}>
                  <div className="image">
                    {getImageUrl(item) ? (
                      <img src={getImageUrl(item)} alt={getImageAlt(item)} />
                    ) : (
                      <ImagePlaceholder type="card" />
                    )}
                  </div>
                  <div className="title">{getItemTitle(item)}</div>
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
