package eu.zavadil.ocr.service.folders;

import eu.zavadil.java.ocr.common.parsed.folder.FolderChain;
import eu.zavadil.java.spring.common.entity.cache.RepositoryHashCache;
import eu.zavadil.ocr.data.parsed.FolderChainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FolderChainCache extends RepositoryHashCache<FolderChain> {

	@Autowired
	public FolderChainCache(FolderChainRepository repository) {
		super(repository);
	}

}
