import React, {Fragment} from 'react';
import {Box, Flex} from 'theme-ui';
import {Popconfirm} from 'antd';
import {colors, Button, Select, Text, Title, Tooltip} from '../common';
import {
  CheckOutlined,
  DeleteOutlined,
  StarOutlined,
  StarFilled,
  UploadOutlined,
  UserOutlined,
} from '../icons';

const ConversationHeader = ({
  conversation,
  users,
  onAssignUser,
  onMarkPriority,
  onRemovePriority,
  onCloseConversation,
  onReopenConversation,
  onDeleteConversation,
}: {
  conversation: any;
  users: Array<any>;
  onAssignUser: (conversationId: string, userId: string) => void;
  onMarkPriority: (conversationId: string) => void;
  onRemovePriority: (conversationId: string) => void;
  onCloseConversation: (conversationId: string) => void;
  onReopenConversation: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
}) => {
  if (!conversation) {
    // No point in showing the header if no conversation exists
    return null;
  }

  const {
    id: conversationId,
    assignee_id,
    status,
    priority,
    customer = {},
  } = conversation;
  const {name, email} = customer;
  const assigneeId = assignee_id ? String(assignee_id) : undefined;
  const hasBothNameAndEmail = !!(name && email);

  return (
    <header
      style={{
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 2rem',
        zIndex: 1,
        opacity: status === 'closed' ? 0.8 : 1,
      }}
    >
      <Flex
        py={3}
        px={4}
        backgroundColor={colors.white}
        sx={{justifyContent: 'space-between', alignItems: 'center'}}
      >
        <Box>
          <Title
            level={4}
            style={{marginBottom: 0, marginTop: hasBothNameAndEmail ? 0 : 4}}
          >
            {name || email || 'Anonymous User'}
          </Title>
          {hasBothNameAndEmail && (
            <Box style={{marginLeft: 1}}>
              <Text type="secondary">{email}</Text>
            </Box>
          )}
        </Box>

        <Flex mx={-1}>
          <Box mx={1}>
            <Select
              style={{minWidth: 240}}
              placeholder="No assignee"
              value={assigneeId ? String(assigneeId) : undefined}
              onSelect={(userId) =>
                onAssignUser(conversationId, String(userId))
              }
            >
              {users.map((user: any) => {
                const value = String(user.id);

                return (
                  <Select.Option key={value} value={value}>
                    <Flex sx={{alignItems: 'center'}}>
                      <UserOutlined style={{marginRight: 8, fontSize: 12}} />
                      <Box>{user.name || user.email}</Box>
                    </Flex>
                  </Select.Option>
                );
              })}
            </Select>
          </Box>
          <Box mx={1}>
            {priority === 'priority' ? (
              <Tooltip title="Remove priority" placement="bottomRight">
                <Button
                  icon={<StarFilled style={{color: colors.gold}} />}
                  onClick={() => onRemovePriority(conversationId)}
                />
              </Tooltip>
            ) : (
              <Tooltip title="Mark as priority" placement="bottomRight">
                <Button
                  icon={<StarOutlined />}
                  onClick={() => onMarkPriority(conversationId)}
                />
              </Tooltip>
            )}
          </Box>

          {status === 'closed' ? (
            <Fragment>
              <Box mx={1}>
                <Tooltip title="Reopen conversation" placement="bottomRight">
                  <Button
                    icon={<UploadOutlined />}
                    onClick={() => onReopenConversation(conversationId)}
                  />
                </Tooltip>
              </Box>
              {/*

              FIXME: there's an issue deleting conversations that have associated
              Slack conversations:
                ** (Ecto.ConstraintError) constraint error when attempting to delete struct:
                * slack_conversation_threads_conversation_id_fkey (foreign_key_constraint)

              Need to fix that before uncommenting this.

              <Box mx={1}>
                <Popconfirm
                  title="Are you sure you want to delete this conversation?"
                  okText="Yes"
                  cancelText="No"
                  placement="leftBottom"
                  onConfirm={() => onDeleteConversation(conversationId)}
                >
                  <Tooltip title="Delete conversation" placement="bottomRight">
                    <Button icon={<DeleteOutlined />} />
                  </Tooltip>
                </Popconfirm>
              </Box>

              */}
            </Fragment>
          ) : (
            <Box mx={1}>
              <Tooltip title="Close conversation" placement="bottomRight">
                <Button
                  icon={<CheckOutlined />}
                  onClick={() => onCloseConversation(conversationId)}
                />
              </Tooltip>
            </Box>
          )}
        </Flex>
      </Flex>
    </header>
  );
};

export default ConversationHeader;
