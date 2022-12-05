import { axiosClient } from 'libraries/axiosClient';
import React from 'react';

type Props = {};

export default function LegacyCategories({}: Props) {
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [refresh, setRefresh] = React.useState(0);

  React.useEffect(() => {
    setLoading(true);
    axiosClient.get('/categories').then((response: any) => {
      setCategories(response);
      setLoading(false);
    });
  }, [refresh]);

  return (
    <div>
      <button
        onClick={() => {
          setRefresh((f) => f + 1);
        }}
      >
        Reload
      </button>
      {loading && <div>Loading ...</div>}
      {categories &&
        categories.map((c: any) => {
          return (
            <div key={c._id}>
              <strong>{c.name}</strong>
            </div>
          );
        })}
    </div>
  );
}
