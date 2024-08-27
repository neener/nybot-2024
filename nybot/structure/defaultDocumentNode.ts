import type { DefaultDocumentNodeResolver } from 'sanity/structure';
import DocumentsPane from 'sanity-plugin-documents-pane';

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) => {
  switch (schemaType) {
    case `artist`:
      return S.document().views([
        S.view.form(),
        S.view
          .component(DocumentsPane)
          .options({
            query: `*[_type == "happening" && references($id)]`,
            params: { id: `_id` },
            options: { perspective: 'previewDrafts' }
          })
          .title('Happenings'),
        S.view
          .component(DocumentsPane)
          .options({
            query: `*[_type == "publication" && references($id)]`,
            params: { id: `_id` },
            options: { perspective: 'previewDrafts' }
          })
          .title('Publications'),
        S.view
          .component(DocumentsPane)
          .options({
            query: `*[_type == "artwork" && references($id)]`,
            params: { id: `_id` },
            options: { perspective: 'previewDrafts' }
          })
          .title('Artworks'),
      ]);
    default:
      return S.document().views([S.view.form()]);
  }
};
