import {ObjectUtil, PagingRequest} from 'incomaker-react-ts-commons';
import React, {PropsWithChildren} from 'react';
import {Pagination, Table} from "react-bootstrap";
import {BsFillCaretDownFill, BsFillCaretUpFill} from 'react-icons/bs';
import {TableHeader} from "../../types/TableHeader";

const MAX_DISPLAY_PAGES = 10;

export type AdvancedTableProps = {
	header: TableHeader;
	paging: PagingRequest;
	totalPages: number;
	totalItems: number;
	onPagingChanged: (p: PagingRequest) => any
};

function AdvancedTable({header, children, paging, totalPages, totalItems, onPagingChanged}: PropsWithChildren<AdvancedTableProps>) {

	const sortingChanged = (e: React.MouseEvent<HTMLTableCellElement>, fieldName: string) => {
		let field = paging.sorting.find((f) => f.name === fieldName);
		const isSoleField = field && paging.sorting.length === 1;
		if (!(e.ctrlKey || isSoleField)) {
			paging.sorting = [];
			field = undefined;
		}
		if (field) {
			field.desc = !field.desc;
		} else {
			paging.sorting.push({name: fieldName});
		}
		onPagingChanged(ObjectUtil.clone(paging));
	}

	const pageChanged = (page: number) => {
		paging.page = page;
		onPagingChanged(ObjectUtil.clone(paging));
	}

	const paginationItems = [];
	if (totalPages > 1) {
		paginationItems.push(<Pagination.First key="first" onClick={() => pageChanged(0)} disabled={paging.page === 0}/>);
		paginationItems.push(<Pagination.Prev key="prev" onClick={() => pageChanged(paging.page - 1)} disabled={paging.page === 0}/>);

		let start = 0;
		let end = totalPages - 1;

		if (paging.page >= MAX_DISPLAY_PAGES) {
			const maxPagesSide = Math.round((MAX_DISPLAY_PAGES - 3) / 2);
			start = paging.page - maxPagesSide;
		}

		if (start > (totalPages - MAX_DISPLAY_PAGES)) {
			start = totalPages - MAX_DISPLAY_PAGES;
		}

		end = start + MAX_DISPLAY_PAGES;

		if (start < 0) start = 0;
		if (end >= totalPages) end = totalPages - 1;

		if (start > 0) {
			paginationItems.push(<Pagination.Ellipsis key="ellipsis"/>);
		}

		for (let number = start; number <= end; number++) {
			paginationItems.push(
				<Pagination.Item key={number} active={number === paging.page} onClick={() => pageChanged(number)}>
					{number + 1}
				</Pagination.Item>,
			);
		}

		if (end < (totalPages - 1)) {
			paginationItems.push(<Pagination.Ellipsis key="ellipsis"/>);
		}

		paginationItems.push(<Pagination.Next key="next" onClick={() => pageChanged(paging.page + 1)} disabled={paging.page === (totalPages - 1)}/>);
		paginationItems.push(<Pagination.Last key="last" onClick={() => pageChanged(totalPages - 1)} disabled={paging.page === (totalPages - 1)}/>);
	}

	const pagination = <div className="mb-3 d-flex justify-content-between align-items-center">
		<div>Page: {paging.page + 1} / {totalPages}</div>
		<Pagination size="sm" className="flex-wrap">{paginationItems}</Pagination>
		<div>Total Items: {totalItems}</div>
	</div>;

	return (
		<div>
			{pagination}
			<Table responsive bordered>
				<thead>
				<tr>
					{
						header.map(
							(h, index) => {
								if (h.name === '') {
									return <th key={index}>{h.label}</th>
								}
								const field = paging.sorting.find((s) => s.name === h.name);
								return (
									<th
										key={index}
										role="button"
										onClick={(e: React.MouseEvent<HTMLTableCellElement>) => sortingChanged(e, h.name)}
									>
										{h.label}
										{
											field ? field.desc ? <BsFillCaretDownFill/> : <BsFillCaretUpFill/> : <></>
										}
									</th>
								)
							}
						)
					}
				</tr>
				</thead>
				<tbody>
				{children}
				</tbody>
			</Table>
			{pagination}
		</div>
	);
}

export default AdvancedTable;
