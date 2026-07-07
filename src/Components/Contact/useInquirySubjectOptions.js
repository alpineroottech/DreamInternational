import { useEffect, useState } from "react";
import { publicApi } from "../../public-cms/hooks";
import { getCategoryConfig } from "./inquiryFormConfig";

/**
 * Loads published CMS items for the selected inquiry category (tour, destination, etc.).
 */
export function useInquirySubjectOptions(inquiryCategory) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const config = getCategoryConfig(inquiryCategory);

  useEffect(() => {
    if (!config.apiPath) {
      setOptions([]);
      setLoading(false);
      return undefined;
    }

    let active = true;
    setLoading(true);
    publicApi
      .get(config.apiPath)
      .then(({ data }) => {
        if (!active) return;
        const rows = Array.isArray(data) ? data : [];
        setOptions(
          rows.map((row) => ({
            slug: row[config.slugKey] || "",
            id: config.idKey ? row[config.idKey] || "" : "",
            label: row[config.labelKey] || "Untitled",
          }))
        );
      })
      .catch(() => active && setOptions([]))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [config.apiPath, config.slugKey, config.labelKey, config.idKey]);

  return { options, loading, hasPicker: Boolean(config.apiPath) };
}
