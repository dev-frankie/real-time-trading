import type { ReactElement } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  AllCommunityModule,
  type CustomCellRendererProps,
  ModuleRegistry,
  type ColDef,
  type RowClickedEvent,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

import type { OrderItem } from "@/entities/orderbook";
import { formatNumber } from "@/shared/lib/number-format";
import { UiSection } from "@/shared/ui/semantic";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([AllCommunityModule]);

interface OrderBookProps {
  items: OrderItem[];
  onSelectOrder: (item: OrderItem) => void;
}

function TimelineCellRenderer({
  value,
  data,
}: CustomCellRendererProps<OrderItem, OrderItem["timeline"]>): ReactElement {
  const timeline = value ?? data?.timeline ?? [];
  if (timeline.length === 0) {
    return <span className="text-(--color-text-secondary)">-</span>;
  }

  const maxValue = Math.max(...timeline, 1);

  return (
    <div className="orderbook-timeline" aria-hidden={true}>
      {timeline.map((point, index) => {
        const ratio = point / maxValue;
        let bucket = 1;

        if (ratio >= 0.875) {
          bucket = 8;
        } else if (ratio >= 0.75) {
          bucket = 7;
        } else if (ratio >= 0.625) {
          bucket = 6;
        } else if (ratio >= 0.5) {
          bucket = 5;
        } else if (ratio >= 0.375) {
          bucket = 4;
        } else if (ratio >= 0.25) {
          bucket = 3;
        } else if (ratio >= 0.125) {
          bucket = 2;
        }

        return (
          <span
            key={`${data?.id ?? "timeline"}-${index}`}
            className={`orderbook-timeline-bar orderbook-timeline-bar-h${bucket}`}
          />
        );
      })}
    </div>
  );
}

export function OrderBook({ items, onSelectOrder }: OrderBookProps): ReactElement {
  const { t } = useTranslation();
  const columnDefs = useMemo<ColDef<OrderItem>[]>(
    () => [
      {
        headerName: t("orderBook.type"),
        field: "type",
        width: 120,
        minWidth: 120,
        maxWidth: 120,
        valueFormatter: (params) =>
          params.value === "buy" ? t("orderBook.buy") : t("orderBook.sell"),
        cellClass: (params) =>
          params.data?.type === "buy"
            ? "orderbook-cell-type-buy"
            : "orderbook-cell-type-sell",
      },
      {
        headerName: t("orderBook.price"),
        field: "price",
        flex: 1,
        valueFormatter: (params) => formatNumber(Number(params.value ?? 0)),
        cellClass: (params) =>
          params.data?.type === "buy"
            ? "orderbook-cell-price-buy"
            : "orderbook-cell-price-sell",
      },
      {
        headerName: t("orderBook.quantity"),
        field: "quantity",
        width: 120,
        minWidth: 120,
        maxWidth: 120,
        valueFormatter: (params) => formatNumber(Number(params.value ?? 0)),
      },
      {
        headerName: t("orderBook.timeline"),
        field: "timeline",
        flex: 1,
        minWidth: 180,
        sortable: false,
        filter: false,
        cellRenderer: TimelineCellRenderer,
      },
    ],
    [t],
  );

  const defaultColDef = useMemo<ColDef<OrderItem>>(
    () => ({
      sortable: false,
      filter: false,
      suppressMovable: true,
    }),
    [],
  );

  const handleRowClick = (event: RowClickedEvent<OrderItem>): void => {
    if (!event.data) {
      return;
    }

    onSelectOrder(event.data);
  };

  return (
    <UiSection
      className="mx-auto flex h-full w-full max-w-[680px] flex-col overflow-hidden"
      aria-label={t("orderBook.ariaLabel")}
    >
      <div className="ag-theme-quartz orderbook-grid-theme h-full w-full">
        <AgGridReact<OrderItem>
          rowData={items}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          getRowId={(params) => params.data.id}
          animateRows={true}
          rowHeight={48}
          headerHeight={48}
          suppressRowHoverHighlight={false}
          getRowClass={(params) =>
            params.data?.type === "buy" ? "orderbook-row-buy" : "orderbook-row-sell"
          }
          onRowClicked={handleRowClick}
        />
      </div>
    </UiSection>
  );
}
