using Bookshelf.Data;
using Bookshelf.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bookshelf.Hubs
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ChatHub : Hub
    {
        public string currentChat;
        private readonly UserManager<User> _userManager;
        private readonly BookContext _context;

        public ChatHub(UserManager<User> userManager, BookContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        public override Task OnConnectedAsync()
        {
            User user = _userManager.FindByIdAsync(Context.UserIdentifier).Result;

            try
            {
                var existingConnection = _context.HubConnections.FirstOrDefault(connection => connection.UserId == user.Id);

                if (existingConnection != null)
                {
                    Clients.Client(existingConnection.ConnectionId).SendAsync("Alert",
                        "This connection was closed by a more recent connection. Reload the page to reconnect.");
                    _context.HubConnections.Remove(existingConnection);
                }                

                _context.HubConnections.Add(new HubConnection
                {
                    User = user,
                    ConnectionId = Context.ConnectionId,
                    CreatedAt = DateTime.UtcNow
                });

                try
                {
                    _context.SaveChanges();
                }
                catch (Exception)
                {
                    Clients.Client(existingConnection.ConnectionId).SendAsync("Alert",
                        "This connection was closed by a more recent connection. Reload the page to reconnect.");
                }

                SendContactList(user.Id);

                RequireConnectionUpdates(user.Id, user.UserName, Context.ConnectionId);

                return base.OnConnectedAsync();
            }
            catch (Exception e)
            {
                Clients.Client(Context.ConnectionId).SendAsync("Alert",
                       "Unable to connect. Reload the page and try again.");

                System.Diagnostics.Trace.WriteLine(e.ToString());

                return null;
            }
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "Users");

            await CloseActiveChats();

            HubConnection connection = _context.HubConnections.FirstOrDefault(
                    x => x.ConnectionId == Context.ConnectionId);
            _context.Remove(connection);
            await _context.SaveChangesAsync();

            User user = _userManager.FindByIdAsync(Context.UserIdentifier).Result;

            await RequireConnectionUpdates(user.Id, user.UserName, "offline");
            

            await base.OnDisconnectedAsync(exception);
        }

        public async Task<bool> OpenChat(string username)
        {
            User user = await _userManager.FindByIdAsync(Context.UserIdentifier);
            User target = await _userManager.FindByNameAsync(username);

            await CloseActiveChats();

            var chat = (from activeChat in _context.ActiveChats
                        where (activeChat.User1.UserName == username && activeChat.User2.Id == user.Id)
                        || (activeChat.User2.UserName == username && activeChat.User1.Id == user.Id)
                        select activeChat).ToList().FirstOrDefault();

            if (chat == null)
            {
                _context.ActiveChats.Add(new ActiveChat
                {
                    User1 = user,
                    User2 = target,
                    Connected1 = true,
                    Connected2 = false,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow

                });
                await _context.SaveChangesAsync();
            }
            else
            {
                if (chat.User1.Id == user.Id)
                {
                    chat.Connected1 = true;
                }
                else if (chat.User2.Id == user.Id)
                {
                    chat.Connected2 = true;
                }
                chat.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                NotifyOnlineStatus(user, target);
            }
            await MarkAsRead(username);
            await GetMessages(username);

            return true;
        }

        public async void NotifyOnlineStatus(User user, User target)
        {
            var client = _context.HubConnections.First(x => x.UserId == target.Id);

            await Clients.Client(client.ConnectionId).SendAsync("ReceiveOnlineStatusNotification", user.UserName);
        }

        public async Task<bool> CloseActiveChats()
        {
            try
            {
                var chats = GetActiveChats();

                if (chats.Count > 0)
                {
                    var user = _context.HubConnections.FirstOrDefault(connection => connection.ConnectionId == Context.ConnectionId);

                    foreach (ActiveChat chat in chats)
                    {
                        if ((chat.UserId1 == user.UserId && chat.Connected2 == false)
                        || (chat.UserId2 == user.UserId && chat.Connected1 == false))
                        {
                            _context.ActiveChats.Remove(chat);
                        }
                        else if (chat.UserId1 == user.UserId)
                        {
                            chat.Connected1 = false;
                        }
                        else if (chat.UserId2 == user.UserId)
                        {
                            chat.Connected2 = false;
                        }
                    }

                    await _context.SaveChangesAsync();
                }
                return true;
            }
            catch(Exception e)
            {
                System.Diagnostics.Trace.WriteLine(e.ToString());

                return false;
            }

        }

        public Task SendMessage(ChatMessage message)
        {
            try
            {
                HubConnection client = _context.HubConnections.FirstOrDefault(
                    connection => connection.ConnectionId == Context.ConnectionId);
                HubConnection target = _context.HubConnections.FirstOrDefault(
                    connection => connection.User.UserName == message.To);
                message.CreatedAt = DateTime.UtcNow;
                message.Read = false;

                try
                {
                    ActiveChat currentChat = GetActiveChats().FirstOrDefault();

                    if (currentChat != null && client != null && target != null)
                    {
                        if (currentChat.UserId1 == client.UserId && currentChat.UserId2 == target.UserId)
                        {
                            if (currentChat.Connected2 == true)
                            {
                                message.Read = true;
                            }
                            return Clients.Clients(target.ConnectionId, Context.ConnectionId).SendAsync("ReceiveMessage", message);
                        }
                        else if (currentChat.UserId2 == client.UserId && currentChat.UserId1 == target.UserId)
                        {
                            if( currentChat.Connected1 == true)
                            {
                                message.Read = true;
                            }

                            return Clients.Clients(target.ConnectionId, Context.ConnectionId).SendAsync("ReceiveMessage", message);
                        }
                        else
                        {
                            return Clients.Client(Context.ConnectionId).SendAsync("ReceiveMessage", message);
                        }
                    }
                    else
                    {
                        return Clients.Client(Context.ConnectionId).SendAsync("ReceiveMessage", message);
                    }
                }
                finally
                {
                    _context.ChatMessages.Add(message);
                    _context.SaveChanges();
                }

            }
            catch(Exception e)
            {
                Clients.Client(Context.ConnectionId).SendAsync("Alert",
                       "Could not send message. Reload the page and try again.");

                System.Diagnostics.Trace.WriteLine(e.ToString());

                return null;
            }

        }

        public Task GetMessages(string username)
        {
            HubConnection client = (from connection in _context.HubConnections
                                   where (connection.ConnectionId == Context.ConnectionId)
                                   select connection).FirstOrDefault();

            if(client == null)
            {
                return Clients.Client(Context.ConnectionId).SendAsync("Alert", 
                            "This connection was closed by a more recent connection. Reload the page to reconnect.");
            }
            client.User = _context.Users.Find(client.UserId);

            User target = (from user in _context.Users
                                    where (user.UserName == username)
                                    select user).FirstOrDefault();

            var query = (from message in _context.ChatMessages
                         where ((message.From == target.UserName && message.To == client.User.UserName && !message.DeletedByReceiver)
                         || (message.From == client.User.UserName && message.To == target.UserName && !message.DeletedBySender))
                         select message).ToList();

            foreach (ChatMessage message in query)
            {
                if (message.To == client.User.UserName)
                {
                    message.Read = true;
                }
            }
            _context.SaveChanges();

            currentChat = username;

            List<ChatMessage> messages = query.ToList();
            return Clients.Client(client.ConnectionId).SendAsync("GetMessages", messages);
        }

        public Task SendContactList(string userId)
        {
            var contacts =
                ((from friend in _context.Friends
                  where (friend.UserId1 == userId && friend.Accepted == true)
                  join connection in _context.HubConnections on friend.UserId2 equals connection.UserId into connected
                  from status in connected.DefaultIfEmpty()
                  select new ConnectionDTO
                  {
                      Id = status.ConnectionId ?? "offline",
                      Username = friend.User2.UserName,
                      Connected = status.ConnectionId != null
                  })
                .Concat(from friend in _context.Friends
                        where (friend.UserId2 == userId && friend.Accepted == true)
                        join connection in _context.HubConnections on friend.UserId1 equals connection.UserId into connected
                        from status in connected.DefaultIfEmpty()
                        select new ConnectionDTO
                        {
                            Id = status.ConnectionId ?? "offline",
                            Username = friend.User1.UserName,
                            Connected = status.ConnectionId != null
                        }))
                .ToList();

            var client = _context.HubConnections.First(x => x.UserId == userId);

            foreach (ConnectionDTO connection in contacts)
            {
                int count = (from message in _context.ChatMessages
                             where message.From == connection.Username && message.To == client.User.UserName && message.Read == false
                             select message).Count();

                connection.NewMessages = count;
            }

            return Clients.Client(client.ConnectionId).SendAsync("ReceiveContactList", contacts);
        }

        public Task RequireConnectionUpdates(string userId, string username, string connectionId)
        {
            var connections =
                ((from friend in _context.Friends
                  where (friend.UserId1 == userId && friend.Accepted == true)
                  join connection in _context.HubConnections on friend.UserId2 equals connection.UserId
                  select new ConnectionDTO
                  {
                      Id = connection.ConnectionId,
                      Username = connection.User.UserName
                  })
                .Concat(from friend in _context.Friends
                        where (friend.UserId2 == userId && friend.Accepted == true)
                        join connection in _context.HubConnections on friend.UserId1 equals connection.UserId
                        select new ConnectionDTO
                        {
                            Id = connection.ConnectionId,
                            Username = connection.User.UserName
                        }))
                .ToList();

            foreach (ConnectionDTO connection in connections)
            {
                int count = (from message in _context.ChatMessages
                             where message.From == username && message.To == connection.Username && message.Read == false
                             select message).Count();

                SendConnectionUpdates(connection.Id, new ConnectionDTO
                {
                    Id = connectionId,
                    Username = username,
                    Connected = connectionId != "offline",
                    NewMessages = count
                });

            }
            return Task.CompletedTask;
        }

        public Task SendConnectionUpdates(string connectionId, ConnectionDTO connection)
        {
            return Clients.Client(connectionId).SendAsync("ReceiveConnectionUpdates", connection);
        }

        public Task MarkAsRead(string username)
        {
            User user = _userManager.FindByIdAsync(Context.UserIdentifier).Result;

            (from message in _context.ChatMessages
             where message.From == username && message.To == user.UserName && message.Read == false
             select message)
            .ToList().ForEach(message => message.Read = true);

            return Task.CompletedTask;
        }

        public Task DeleteMessages(string username)
        {
            User user = _userManager.FindByIdAsync(Context.UserIdentifier).Result;

            (from message in _context.ChatMessages
             where (message.From == username && message.To == user.UserName)
             select message)
            .ToList().ForEach(message => message.DeletedByReceiver = true);

            (from message in _context.ChatMessages
             where (message.From == user.UserName && message.To == username)
             select message)
            .ToList().ForEach(message => message.DeletedBySender = true);

            (from message in _context.ChatMessages
             where (message.From == user.UserName && message.To == username) || (message.From == username && message.To == user.UserName)
             select message)
            .ToList().ForEach(message => {
                if (message.DeletedBySender && message.DeletedByReceiver) _context.ChatMessages.Remove(message);
            });

            GetMessages(username);

            return Task.CompletedTask;
        }

        public List<ActiveChat> GetActiveChats()
        {
            List<ActiveChat> currentChats = (from connection in _context.HubConnections
                                      from chat in _context.ActiveChats
                                      where ((connection.ConnectionId == Context.ConnectionId
                                       && connection.UserId == chat.UserId1
                                       && chat.Connected1 == true)
                                       || (connection.ConnectionId == Context.ConnectionId
                                       && connection.UserId == chat.UserId2
                                       && chat.Connected2 == true))
                                      select chat).ToList();

            return currentChats;
        }
    }
}
