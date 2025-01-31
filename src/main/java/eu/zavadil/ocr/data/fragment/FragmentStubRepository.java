package eu.zavadil.ocr.data.fragment;

import eu.zavadil.ocr.data.RepositoryBase;

import java.util.List;

public interface FragmentStubRepository extends RepositoryBase<FragmentStub> {
	
	List<FragmentStub> findAllByDocumentId(int documentId);

}
