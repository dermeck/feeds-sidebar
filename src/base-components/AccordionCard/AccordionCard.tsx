import { CaretDown, CaretUp } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

/**
 * Collapsible, bordered card modeled after Mozilla's <moz-card type="accordion">
 * used in the Firefox sidebar history view (Chronik) — see
 * browser/components/sidebar/sidebar-history.mjs: #dateCardTemplate() and
 * toolkit/content/widgets/moz-card/moz-card.css.
 * A rounded pill container that expands to a bigger pill revealing its content.
 */
export const AccordionCard = ({
    title,
    children,
    expanded,
    onClick,
}: {
    title: string;
    children: React.ReactNode;
    expanded: boolean;
    onClick: () => void;
}) => {
    return (
        <div className={clsx('accordion-card', expanded && 'accordion-card--expanded')}>
            <button type="button" className="accordion-card__header" onClick={onClick} aria-expanded={expanded}>
                <span>{expanded ? <CaretDown weight="bold" /> : <CaretUp weight="bold" />}</span>
                <span className="accordion-card__header-title">{title}</span>
            </button>
            {expanded && <div className="accordion-card__content">{children}</div>}
        </div>
    );
};
