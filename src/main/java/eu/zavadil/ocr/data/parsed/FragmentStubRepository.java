package eu.zavadil.ocr.data.parsed;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import eu.zavadil.java.ocr.common.parsed.fragment.FragmentStub;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FragmentStubRepository extends EntityRepository<FragmentStub> {

	@Query("""
		select f
		from FragmentStub f
		where f.pageId in (
			select p.id from PageStub p where p.documentId = :documentId
		)
		and f.id not in :existingIds
		""")
	List<FragmentStub> loadExtra(@Param("documentId") int documentId, @Param("existingIds") List<Integer> existingIds);

}
