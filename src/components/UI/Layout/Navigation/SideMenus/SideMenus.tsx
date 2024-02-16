import { useState, useEffect, forwardRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ListItemButton, ListItemIcon, ListItemText, List, Divider } from '@mui/material';
import { useLazyQuery } from '@apollo/client';
import LinkIcon from 'assets/images/icons/UrlLink.svg?react';
import BackIcon from 'assets/images/icons/SideDrawerBack.svg?react';
import { GET_NOTIFICATIONS_COUNT } from 'graphql/queries/Notifications';
import ListIcon from 'components/UI/ListIcon/ListIcon';
import { getSideDrawerMenus } from 'context/role';
import styles from './SideMenus.module.css';
import { useTranslation } from 'react-i18next';

export interface SideMenusProps {
  opened: boolean;
}

const AnchorLink = forwardRef((props, ref: any) => <a {...props} ref={ref} />);

const SideMenus = ({ opened }: SideMenusProps) => {
  const [children, setSubMenu] = useState({ active: false, value: '' });
  const location = useLocation();
  const { t } = useTranslation();

  // handle count for notifictions
  const [notificationCount, setNotificationCount] = useState(0);
  const [getNotificationCount] = useLazyQuery(GET_NOTIFICATIONS_COUNT, {
    variables: {
      filter: {
        is_read: false,
        severity: 'critical',
      },
    },
    fetchPolicy: 'cache-and-network',
    onCompleted: (countData) => {
      setNotificationCount(countData.countNotifications);
    },
  });

  useEffect(() => {
    getNotificationCount();
  }, []);

  useEffect(() => {
    if (location.state && location.state.children) {
      setSubMenu(location.state.children);
    }
  }, [location]);
  // let's get count specific to menu paths
  // we should check for menu path if we have badges for other items.
  // For now we have only one badge for notifications so returning that only

  const menuObj = getSideDrawerMenus();

  const links = menuObj.filter((menu) => menu.url);
  const menuList = menuObj.filter((menu) => !menu.url);

  let menuToDisplay = menuList;
  let subMenuTitle = '';

  if (children.active) {
    const activeSubmenu = menuObj.filter((menu) => menu.path === children.value);
    if (activeSubmenu.length > 0) {
      menuToDisplay = activeSubmenu[0].children ? activeSubmenu[0].children : [];
      subMenuTitle = activeSubmenu[0].title.toUpperCase();
    }
  }

  const linksDisplay = links.map((link) => {
    const listItemButton = (
      <ListItemButton
        disableRipple
        className={opened ? styles.OpenItem : styles.ClosedItem}
        classes={{
          root: styles.IconItem,
          selected: styles.SelectedItem,
        }}
        key={link.title}
        component={AnchorLink}
        {...{ target: '_blank', href: link.url, rel: 'noopener noreferrer' }}
      >
        <ListItemIcon className={styles.ListItemIcon}>
          <ListIcon icon={link.icon} />
        </ListItemIcon>
        {opened && (
          <>
            <ListItemText
              disableTypography
              data-testid="list-item"
              className={styles.UnselectedText}
              primary={t(link.title as any)}
            />
            <LinkIcon />
          </>
        )}
      </ListItemButton>
    );
    return listItemButton;
  });

  const backButton = (
    <ListItemButton
      disableRipple
      className={opened ? styles.OpenItem : styles.ClosedItem}
      classes={{
        root: styles.IconItem,
        selected: styles.SelectedItem,
      }}
      onClick={() => setSubMenu({ active: false, value: '' })}
    >
      <ListItemIcon>
        <BackIcon />
      </ListItemIcon>
      {opened && (
        <ListItemText
          disableTypography
          data-testid="list-item"
          className={styles.UnselectedText}
          primary={t('back')}
        />
      )}
    </ListItemButton>
  );

  const menuListDisplay = menuToDisplay
    .filter((menu) => !menu.show)
    .map((menu) => {
      const isSelected = location.pathname.startsWith(menu.path);
      let redirectPath = menu.path;

      const listItemButton = (
        <ListItemButton
          disableRipple
          selected={isSelected}
          className={opened ? styles.OpenItem : styles.ClosedItem}
          classes={{
            root: styles.IconItem,
            selected: styles.SelectedItem,
          }}
          onClick={() => {
            if (!menu.children) return;
            if (children.active) {
              setSubMenu({ active: false, value: menu.path });
            } else {
              setSubMenu({ active: true, value: menu.path });
            }
          }}
          key={menu.title}
          component={NavLink}
          to={redirectPath}
        >
          <ListItemIcon className={styles.ListItemIcon}>
            <ListIcon selected={isSelected} icon={menu.icon} count={notificationCount} />
          </ListItemIcon>
          {opened && (
            <ListItemText
              disableTypography
              data-testid="list-item"
              className={isSelected ? styles.SelectedText : styles.UnselectedText}
              primary={t(menu.title as any)}
            />
          )}
        </ListItemButton>
      );

      return listItemButton;
    });

  return (
    <List className={styles.List} data-testid="list">
      {children.active && (
        <>
          {backButton}
          <div className={opened ? styles.SubMenuTitleOpen : styles.SubMenuTitleClose}>
            {subMenuTitle}
          </div>
        </>
      )}
      <div className={children.active ? styles.Transition : ''}>{menuListDisplay}</div>
      <Divider className={styles.Divider} />
      {linksDisplay}
    </List>
  );
};

export default SideMenus;
