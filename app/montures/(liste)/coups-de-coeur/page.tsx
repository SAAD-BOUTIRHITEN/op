import { catalogRoute } from "@/components/catalog/catalog-route";

const route = catalogRoute("coups-de-coeur");
export const generateMetadata = route.generateMetadata;
export default route.Page;
