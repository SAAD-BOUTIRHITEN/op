import { catalogRoute } from "@/components/catalog/catalog-route";

const route = catalogRoute("lunettes-de-soleil");
export const generateMetadata = route.generateMetadata;
export default route.Page;
