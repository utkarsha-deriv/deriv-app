import classNames from 'classnames';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Icon from '../icon/icon';
import { TItem } from './vertical-tab-header';

type TSideNotes = {
    class_name?: string;
    side_notes: React.ReactNode[] | null;
};

type TContentWrapper = {
    has_side_note?: boolean;
};

type TContent = {
    is_routed?: boolean;
    items: TItem[];
    selected: TItem;
};

export type TAction_bar = {
    component?: typeof React.Component;
    onClick?: () => void;
    icon: string;
    title?: string;
};

type TVerticalTabContentContainer = TContent & {
    action_bar?: TAction_bar[];
    action_bar_classname?: string;
    className?: string;
    id?: string;
    is_floating?: boolean;
    tab_container_classname?: string;
};

const SideNotes = ({ class_name, side_notes }: TSideNotes) => {
    return (
        <div
            className={classNames('dc-vertical-tab__content-side-note', { [class_name as string]: !!side_notes })}
            data-testid='vertical_tab_side_note'
        >
            {side_notes?.map((note, i) => (
                <div className='dc-vertical-tab__content-side-note-item' key={i}>
                    {note}
                </div>
            ))}
        </div>
    );
};

const ContentWrapper = ({ children, has_side_note }: React.PropsWithChildren<TContentWrapper>) => {
    if (has_side_note) {
        return <div className='dc-vertical-tab__content-inner'>{children}</div>;
    }
    return children as JSX.Element;
};

const Content = ({ is_routed, items, selected }: TContent) => {
    const selected_item = items.find(item => item.label === selected.label);
    const TabContent = selected_item?.value as React.ElementType;
    const [side_notes, setSideNotes] = React.useState<React.ReactNode[] | null>(null);

    const addToNotesQueue = React.useCallback((notes: React.ReactNode[]) => {
        setSideNotes(notes);
    }, []);

    return (
        <React.Fragment>
            {is_routed ? (
                <Switch>
                    {items.map(({ value, component, path, icon }, idx) => {
                        const Component = (value as React.ElementType) || component;
                        return (
                            <Route
                                key={idx}
                                path={path}
                                render={() => <Component component_icon={icon} setSideNotes={addToNotesQueue} />}
                            />
                        );
                    })}
                </Switch>
            ) : (
                <TabContent key={selected_item?.label} className='item-id' setSideNotes={addToNotesQueue} />
            )}
            {selected.has_side_note && (
                // for components that have side note, even if no note is passed currently,
                // we want to keep the column space for side note
                <SideNotes side_notes={side_notes} />
            )}
        </React.Fragment>
    );
};

const VerticalTabContentContainer = ({
    action_bar,
    action_bar_classname,
    className,
    id,
    is_floating,
    is_routed,
    items,
    selected,
    tab_container_classname,
}: TVerticalTabContentContainer) => {
    return (
        <div
            className={classNames('dc-vertical-tab__content', {
                'dc-vertical-tab__content--floating': is_floating,
                [`dc-vertical-tab__content--${className}`]: className,
            })}
        >
            {!is_floating && action_bar && (
                <div
                    className={classNames('dc-vertical-tab__action-bar', {
                        [action_bar_classname as string]: !!action_bar_classname,
                    })}
                >
                    {action_bar.map(({ component, icon, onClick }, idx) => {
                        const Component = component;
                        return Component ? (
                            <Component key={idx} />
                        ) : (
                            <div
                                id={`dt_${id}_close_icon`}
                                className='dc-vertical-tab__action-bar-wrapper'
                                key={idx}
                                onClick={onClick}
                            >
                                <Icon className='dc-vertical-tab__action-bar--icon' icon={icon} />
                            </div>
                        );
                    })}
                </div>
            )}
            <div className={classNames('dc-vertical-tab__content-container', tab_container_classname)}>
                <ContentWrapper has_side_note={selected.has_side_note}>
                    <Content is_routed={is_routed} items={items} selected={selected} />
                </ContentWrapper>
            </div>
        </div>
    );
};

export default VerticalTabContentContainer;
