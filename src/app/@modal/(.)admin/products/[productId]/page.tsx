import ProductContent from "~/app/(modules)/admin/products/[productId]/_components/product-content";
import { Modal } from "~/app/@modal/modal";
import { api } from "~/libs/trpc/server";

type ProductModalProps = {
  params: Promise<{ productId: string }>;
};

export default async function ProductModal({ params }: ProductModalProps) {
  const { productId } = await params;

  const id = Number(productId);
  const product = await api.product.getById({ id });

  return (
    <Modal>
      <ProductContent product={product} modal />
    </Modal>
  );
}
