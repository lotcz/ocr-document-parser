package eu.zavadil.ocr.data;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RepositoryBase<T extends EntityBase> extends JpaRepository<T, Long> {

}
