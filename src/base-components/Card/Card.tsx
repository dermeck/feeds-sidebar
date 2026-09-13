import { CaretDown, CaretUp } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

/**
 * Bordered card modeled after Mozilla's <moz-card> used in the Firefox sidebar
 * history view (Chronik) — see browser/components/sidebar/sidebar-history.mjs
 * and toolkit/content/widgets/moz-card/moz-card.css.
 *
 * type="accordion": a rounded pill container whose header (disclosure + title)
 * expands to a bigger pill revealing its content.
 */
type CardProps =
    | {
          type?: 'default';
          children: React.ReactNode;
          className?: string;
      }
    | {
          type: 'accordion';
          title: string;
          expanded: boolean;
          onClick: () => void;
          children: React.ReactNode;
          className?: string;
      };

export const Card = (props: CardProps) => {
    if (props.type === 'accordion') {
        return (
            <div className={clsx('card', 'card--accordion', props.expanded && 'card--expanded', props.className)}>
                <button type="button" className="card__header" onClick={props.onClick} aria-expanded={props.expanded}>
                    <span>{props.expanded ? <CaretDown weight="bold" /> : <CaretUp weight="bold" />}</span>
                    <span className="card__header-title">{props.title}</span>
                </button>
                {props.expanded && <div className="card__content">{props.children}</div>}
            </div>
        );
    }

    return <div className={clsx('card', props.className)}>{props.children}</div>;
};
