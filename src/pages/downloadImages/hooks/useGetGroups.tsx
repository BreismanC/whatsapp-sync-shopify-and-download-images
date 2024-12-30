import { useState, useEffect } from "react";
import { Option } from "../interfaces";

export interface Group {
  id: string;
  name?: string;
  verifiedName?: string;
  notify?: string;
}

export const useGetGroups = () => {
  const [groups, setGroups] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getGroups = async () => {
    try {
      setLoading(true);
      const response = await fetch("api/v1/contacts");
      const { data } = await response.json();
      const dataWithFormat = formatData(data);
      setGroups(dataWithFormat);
    } catch (error) {
      console.log("Ocurrio un error al obtener los grupos", error);
      setError("Ocurrio un error al obtener los grupos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  return { groups, loading, error };
};

const formatData = (data: Set<Group>) => {
  return Object.values(data).map((item: Group) => ({
    label: item.name
      ? item.name
      : item.verifiedName
      ? item.verifiedName
      : item.notify
      ? item.notify
      : `${item.id}`,
    value: item.id,
  }));
};
