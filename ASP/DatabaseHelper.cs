using Npgsql;

public class DatabaseHelper
{
    internal static int[] GetElementCount(NpgsqlConnection connection, string element1, string element2)
    {
        // Ensure the connection is open
        if (connection.State != System.Data.ConnectionState.Open)
        {
            connection.Open();
        }

        // Define the query with placeholders for the parameters
        var query = @"SELECT element_id FROM public.elements WHERE element_name IN (@element1, @element2)";

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
    internal static int[] GetElementCount(NpgsqlConnection connection, string element1)
    {
        return GetElementCount(connection, element1, element1);
    }


    internal static string[]? CheckMerge(NpgsqlConnection connection, int element1Id, int element2Id)
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

    internal static int GetElementTierById(NpgsqlConnection connection, int element_id)
    {
        if (connection.State != System.Data.ConnectionState.Open)
        {
            connection.Open();
        }

        // Define the query with placeholders for the parameters
        var query = @"SELECT tier FROM public.elements WHERE element_id = @element_id";

        using (var command = new NpgsqlCommand(query, connection))
        {
            command.Parameters.AddWithValue("element_id", element_id);

            // Execute the command and get the result
            using (var reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    return reader.GetInt32(reader.GetOrdinal("tier"));
                }
            }
        }
        return 0;
    }

    internal static void CreateNewElement(NpgsqlConnection connection, string ai_response, string ai_response_emoji, int tier)
    {
        // Ensure the connection is open
        if (connection.State != System.Data.ConnectionState.Open)
        {
            connection.Open();
        }

        // Define the query with placeholders for the parameters
        var query = @"
            INSERT INTO public.elements(
                element_name, emoji, Tier)
            VALUES (@element_name, @emoji, @tier)";

        using (var command = new NpgsqlCommand(query, connection))
        {
            // Add parameters to the command
            command.Parameters.AddWithValue("element_name", ai_response);
            command.Parameters.AddWithValue("emoji", ai_response_emoji);
            command.Parameters.AddWithValue("tier", tier);

            // Execute the command
            command.ExecuteNonQuery();
        }
    }

    internal static int GetElementId(NpgsqlConnection connection, string element_name)
    {
        if (connection.State != System.Data.ConnectionState.Open)
        {
            connection.Open();
        }

        // Define the query with placeholders for the parameters
        var query = @"SELECT element_id FROM public.elements WHERE element_name = @element_name";

        using (var command = new NpgsqlCommand(query, connection))
        {
            // Add parameters to the command
            command.Parameters.AddWithValue("element_name", element_name);

            // Execute the command and get the result
            using (var reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    return reader.GetInt32(reader.GetOrdinal("element_id"));
                }
            }
        }
        return 0;
    }

    internal static void CreateNewRecipe(NpgsqlConnection connection, int element_1_id, int element_2_id, int new_element_id)
    {
        // Ensure the connection is open
        if (connection.State != System.Data.ConnectionState.Open)
        {
            connection.Open();
        }

        // Define the query with placeholders for the parameters
        var query = @"
            INSERT INTO public.recipes(
                element_1_id,element_2_id,element_create_id)
            VALUES (@element_1_id, @element_2_id, @element_create_id)";

        using (var command = new NpgsqlCommand(query, connection))
        {
            // Add parameters to the command
            command.Parameters.AddWithValue("element_1_id", element_1_id);
            command.Parameters.AddWithValue("element_2_id", element_2_id);
            command.Parameters.AddWithValue("element_create_id", new_element_id);

            // Execute the command
            command.ExecuteNonQuery();
        }
    }
}
