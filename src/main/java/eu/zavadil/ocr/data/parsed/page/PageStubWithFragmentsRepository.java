package eu.zavadil.ocr.data.parsed.page;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PageStubWithFragmentsRepository extends EntityRepository<PageStubWithFragments> {

	@Query("""
			select p
			from PageStubWithFragments p
			where p.documentId = :documentId and p.id not in :existingIds
		""")
	List<PageStubWithFragments> loadExtra(@Param("documentId") int documentId, @Param("existingIds") List<Integer> existingIds);

}
