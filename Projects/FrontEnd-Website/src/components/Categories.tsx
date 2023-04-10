import { useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'libraries/axiosClient';
import React from 'react';

type Props = {};

const getCategories = (): any => {
  return axiosClient.get('/categories');
};

export default function Categories({}: Props) {
  const queryClient = useQueryClient();
  // Queries

  const { isLoading, data: categories, refetch, isError } = useQuery({ queryKey: ['getCategories'], queryFn: getCategories });

  return (
    <div>
      <button
        onClick={() => {
          refetch();
          // queryClient.invalidateQueries({ queryKey: ['getCategories'] });
        }}
      >
        refetch
      </button>
      {isLoading && <div>Loading ...</div>}
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
