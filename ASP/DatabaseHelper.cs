using Npgsql;
using System;

public class DatabaseHelper
{
    public static int[] GetElementCount(NpgsqlConnection connection, string element1, string element2)
    {
        // Ensure the connection is open
        if (connection.State != System.Data.ConnectionState.Open)
        {
            connection.Open();
        }

        // Define the query with placeholders for the parameters
        var query = "SELECT element_id FROM public.elements WHERE element_name IN (@element1, @element2)";

        using (var command = new NpgsqlCommand(query, connection))
        {
            command.Parameters.AddWithValue("element1", element1);
            command.Parameters.AddWithValue("element2", element2);

            // Execute the command and get the result
            using (var reader = command.ExecuteReader())
            {
                var ids = new List<int>();
                while (reader.Read())
                {
                    ids.Add(reader.GetInt32(0));
                }
                return ids.ToArray();
            }
        }
    }
    public static string[]? ExecuteElementCreateQuery(NpgsqlConnection connection, int element1Id, int element2Id)
    {
        // Ensure the connection is open
        if (connection.State != System.Data.ConnectionState.Open)
        {
            connection.Open();
        }

        // Define the query with placeholders for the parameters
        var query = @"
            SELECT element_create_id, note, element_name, emoji, element_id
            FROM public.recipes
            INNER JOIN elements ON elements.element_id = recipes.element_create_id
            WHERE element_1_id = @element1Id AND element_2_id = @element2Id";

        using (var command = new NpgsqlCommand(query, connection))
        {
            command.Parameters.AddWithValue("element1Id", element1Id);
            command.Parameters.AddWithValue("element2Id", element2Id);

            // Execute the command and get the result
            using (var reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    var elementCreateId = reader.GetInt32(reader.GetOrdinal("element_create_id"));
                    var note = reader.IsDBNull(reader.GetOrdinal("note")) ? null : reader.GetString(reader.GetOrdinal("note"));
                    var elementName = reader.GetString(reader.GetOrdinal("element_name"));
                    var emoji = reader.GetString(reader.GetOrdinal("emoji"));
                    var elementId = reader.GetInt32(reader.GetOrdinal("element_id"));

                    //Console.WriteLine($"Element Create ID: {elementCreateId}, Note: {note}, Element Name: {elementName} {emoji}");
                    return new string[] { elementName, emoji, elementId.ToString() };
                }
            }
        }
        return null;
    }

}
