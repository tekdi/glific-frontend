import React from 'react';
import { CONTACT_SEARCH_QUERY, GET_CONTACT_COUNT } from '../../../../graphql/queries/Contact';
import styles from './CollectionContactList.module.css';
import { ReactComponent as CollectionIcon } from '../../../../assets/images/icons/Collection/Dark.svg';
import { List } from '../../../List/List';
import { UPDATE_COLLECTION_CONTACTS } from '../../../../graphql/mutations/Collection';

export interface CollectionContactListProps {
  match: any;
  title: string;
}

const columnNames = ['BENEFICIARY', 'ALL COLLECTIONS', 'ACTIONS'];

const getName = (label: string, phone: string) => (
  <>
    <p className={styles.NameText}>{label}</p>
    <p className={styles.Phone}>{phone}</p>
  </>
);

const getCollections = (collections: Array<any>) => (
  <p className={styles.CollectionsText}>
    {collections.map((collection: any) => collection.label).join(', ')}
  </p>
);

const getColumns = ({ name, maskedPhone, groups }: any) => ({
  label: getName(name, maskedPhone),
  groups: getCollections(groups),
});

const dialogTitle = 'Are you sure you want to remove contact from this collection?';
const dialogMessage = 'The contact will no longer receive messages sent to this collection';
const columnStyles = [styles.Name, styles.Phone, styles.Actions];
const collectionIcon = <CollectionIcon className={styles.CollectionIcon} />;

const queries = {
  countQuery: GET_CONTACT_COUNT,
  filterItemsQuery: CONTACT_SEARCH_QUERY,
  deleteItemQuery: UPDATE_COLLECTION_CONTACTS,
};

const columnAttributes = {
  columns: getColumns,
  columnStyles,
};

export const CollectionContactList: React.SFC<CollectionContactListProps> = (props) => {
  const { match, title } = props;
  const collectionId = match.params.id;

  const getDeleteQueryVariables = (id: any) => {
    return {
      input: {
        groupId: collectionId,
        addContactIds: [],
        deleteContactIds: [id],
      },
    };
  };

  return (
    <List
      backLinkButton={{ text: 'Back to all collections', link: '/collection' }}
      dialogTitle={dialogTitle}
      columnNames={columnNames}
      title={title}
      listItem="contacts"
      listItemName="contact"
      searchParameter="name"
      filters={{ includeGroups: collectionId }}
      button={{ show: false, label: '' }}
      pageLink="contact"
      listIcon={collectionIcon}
      deleteModifier={{
        icon: 'cross',
        variables: getDeleteQueryVariables,
        label: 'Remove from this collection',
      }}
      editSupport={false}
      dialogMessage={dialogMessage}
      {...queries}
      {...columnAttributes}
    />
  );
};
