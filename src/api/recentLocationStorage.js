const RECENT_LOCATION_PREFIX = 'recentLocations';
const MAX_RECENT_LOCATIONS = 20;

const getUserKey = () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return null;

  try {
    const payload = JSON.parse(
      atob(accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
    );
    return payload.sub ? `${RECENT_LOCATION_PREFIX}:${payload.sub}` : null;
  } catch {
    return null;
  }
};

const read = () => {
  const key = getUserKey();
  if (!key) return [];

  try {
    const cached = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(cached) ? cached : [];
  } catch {
    return [];
  }
};

const RecentLocationStorage = {
  add(locationInfo) {
    const key = getUserKey();
    if (!key || locationInfo?.locationId == null) return;

    const location = {
      id: locationInfo.locationId,
      name: locationInfo.name ?? '',
      city: locationInfo.address?.city ?? '',
      mainImageUrl: locationInfo.mainImageUrl ?? null,
    };

    const recent = read().filter((item) => item.id !== location.id);
    localStorage.setItem(
      key,
      JSON.stringify([location, ...recent].slice(0, MAX_RECENT_LOCATIONS))
    );
  },

  getRecent(limit = MAX_RECENT_LOCATIONS) {
    return read().slice(0, limit);
  },
};

export default RecentLocationStorage;
