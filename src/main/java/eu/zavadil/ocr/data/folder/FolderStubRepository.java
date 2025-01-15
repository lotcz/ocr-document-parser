package eu.zavadil.ocr.data.folder;

import eu.zavadil.ocr.data.RepositoryBase;
import eu.zavadil.ocr.data.document.DocumentStub;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FolderStubRepository extends RepositoryBase<FolderStub> {

	@Query("""
			select f
			from FolderStub f
			where f.documentTemplate.id = :templateId
			 and (f.parentId = :parentId or (:parentId is null and f.parentId is null))
		""")
	Page<FolderStub> loadChildFoldersByTemplate(@Param("parentId") Integer parentId, @Param("templateId") Integer templateId, Pageable pr);

	@Query("""
			select f
			from FolderStub f
			where f.parentId = :parentId or (:parentId is null and f.parentId is null)
		""")
	Page<FolderStub> loadChildFolders(@Param("parentId") Integer parentId, Pageable pr);

	@Query("""
			select d
			from DocumentStub d
			where d.folderId = :parentId
		""")
	Page<DocumentStub> loadChildDocuments(@Param("parentId") int parentId, Pageable pr);

}
